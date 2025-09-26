from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import os
from typing import Dict, List, Any

app = Flask(__name__)
CORS(app)

class MatchingEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.user_profiles = {}
        self.scholarships = {}
    
    def preprocess_profile(self, profile: Dict[str, Any]) -> str:
        """Convert user profile to text for vectorization"""
        text_parts = []
        
        # Add skills
        if profile.get('skills'):
            text_parts.append(' '.join(profile['skills']))
        
        # Add interests
        if profile.get('interests'):
            text_parts.append(' '.join(profile['interests']))
        
        # Add education info
        if profile.get('major'):
            text_parts.append(profile['major'])
        
        if profile.get('university'):
            text_parts.append(profile['university'])
        
        # Add bio
        if profile.get('bio'):
            text_parts.append(profile['bio'])
        
        return ' '.join(text_parts)
    
    def preprocess_scholarship(self, scholarship: Dict[str, Any]) -> str:
        """Convert scholarship to text for vectorization"""
        text_parts = []
        
        # Add required skills
        if scholarship.get('requiredSkills'):
            text_parts.append(' '.join(scholarship['requiredSkills']))
        
        # Add preferred skills
        if scholarship.get('preferredSkills'):
            text_parts.append(' '.join(scholarship['preferredSkills']))
        
        # Add description
        if scholarship.get('description'):
            text_parts.append(scholarship['description'])
        
        # Add department
        if scholarship.get('department'):
            text_parts.append(scholarship['department'])
        
        # Add university
        if scholarship.get('university'):
            text_parts.append(scholarship['university'])
        
        return ' '.join(text_parts)
    
    def calculate_matching_score(self, user_profile: Dict[str, Any], scholarship: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate matching score between user and scholarship"""
        
        # Text-based similarity
        user_text = self.preprocess_profile(user_profile)
        scholarship_text = self.preprocess_scholarship(scholarship)
        
        if not user_text or not scholarship_text:
            return {
                'score': 0.0,
                'factors': {
                    'skills_match': 0.0,
                    'education_match': 0.0,
                    'experience_match': 0.0,
                    'gpa_match': 0.0
                }
            }
        
        # Calculate text similarity
        try:
            combined_texts = [user_text, scholarship_text]
            tfidf_matrix = self.vectorizer.fit_transform(combined_texts)
            similarity_matrix = cosine_similarity(tfidf_matrix)
            text_similarity = similarity_matrix[0][1]
        except:
            text_similarity = 0.0
        
        # Skills matching
        user_skills = set(skill.lower() for skill in user_profile.get('skills', []))
        required_skills = set(skill.lower() for skill in scholarship.get('requiredSkills', []))
        preferred_skills = set(skill.lower() for skill in scholarship.get('preferredSkills', []))
        
        skills_intersection = user_skills.intersection(required_skills.union(preferred_skills))
        skills_score = len(skills_intersection) / max(len(required_skills.union(preferred_skills)), 1)
        
        # Education level matching
        education_score = 0.0
        user_level = user_profile.get('currentLevel', '').lower()
        scholarship_type = scholarship.get('type', '').lower()
        
        level_mapping = {
            'undergraduate': ['undergraduate'],
            'graduate': ['graduate', 'masters'],
            'phd': ['phd', 'doctoral'],
            'postdoc': ['postdoc', 'postdoctoral']
        }
        
        for level, keywords in level_mapping.items():
            if any(keyword in user_level for keyword in keywords) and any(keyword in scholarship_type for keyword in keywords):
                education_score = 1.0
                break
            elif user_level and scholarship_type:
                education_score = 0.5
        
        # GPA matching
        gpa_score = 0.0
        user_gpa = user_profile.get('gpa', 0)
        min_gpa = scholarship.get('minGpa', 0)
        
        if user_gpa and min_gpa:
            if user_gpa >= min_gpa:
                gpa_score = min(user_gpa / 4.0, 1.0)  # Normalize to 0-1
            else:
                gpa_score = max(0, (user_gpa - min_gpa + 1) / 4.0)
        
        # Calculate weighted final score
        weights = {
            'text_similarity': 0.3,
            'skills_match': 0.4,
            'education_match': 0.2,
            'gpa_match': 0.1
        }
        
        final_score = (
            text_similarity * weights['text_similarity'] +
            skills_score * weights['skills_match'] +
            education_score * weights['education_match'] +
            gpa_score * weights['gpa_match']
        )
        
        return {
            'score': round(final_score, 3),
            'factors': {
                'text_similarity': round(text_similarity, 3),
                'skills_match': round(skills_score, 3),
                'education_match': round(education_score, 3),
                'gpa_match': round(gpa_score, 3)
            }
        }

# Initialize matching engine
matching_engine = MatchingEngine()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'EduMatch AI Service'})

@app.route('/api/v1/matching/calculate', methods=['POST'])
def calculate_matching():
    try:
        data = request.get_json()
        user_profile = data.get('userProfile')
        scholarship = data.get('scholarship')
        
        if not user_profile or not scholarship:
            return jsonify({'error': 'Missing user profile or scholarship data'}), 400
        
        result = matching_engine.calculate_matching_score(user_profile, scholarship)
        
        return jsonify({
            'success': True,
            'data': result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/v1/matching/batch', methods=['POST'])
def calculate_batch_matching():
    try:
        data = request.get_json()
        user_profile = data.get('userProfile')
        scholarships = data.get('scholarships', [])
        
        if not user_profile or not scholarships:
            return jsonify({'error': 'Missing user profile or scholarships data'}), 400
        
        results = []
        for scholarship in scholarships:
            score_data = matching_engine.calculate_matching_score(user_profile, scholarship)
            results.append({
                'scholarshipId': scholarship.get('id'),
                **score_data
            })
        
        # Sort by score descending
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'success': True,
            'data': results
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/v1/recommendations/scholarships', methods=['POST'])
def get_scholarship_recommendations():
    try:
        data = request.get_json()
        user_profile = data.get('userProfile')
        available_scholarships = data.get('scholarships', [])
        limit = data.get('limit', 10)
        
        if not user_profile:
            return jsonify({'error': 'Missing user profile'}), 400
        
        recommendations = []
        for scholarship in available_scholarships:
            score_data = matching_engine.calculate_matching_score(user_profile, scholarship)
            if score_data['score'] > 0.3:  # Minimum threshold
                recommendations.append({
                    'scholarship': scholarship,
                    **score_data
                })
        
        # Sort by score and limit results
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        recommendations = recommendations[:limit]
        
        return jsonify({
            'success': True,
            'data': recommendations
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
