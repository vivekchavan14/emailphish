# 🛡️ Phishing Email Detection System

## 📄 Project Overview
This project implements an intelligent email analysis system that uses machine learning to detect phishing attempts. By analyzing email content (subject lines and body text), the system classifies emails as either legitimate or phishing, providing users with real-time protection against common cyber threats.

## 🔍 Problem Statement
Phishing remains a prevalent cybersecurity threat, with over 30 crore people in India alone vulnerable to such attacks, and approximately 5 lakh falling prey annually. This project aims to mitigate this risk by providing an automated detection tool that complements manual efforts.

## ✨ Key Features
- 🤖 **Multiple ML Models**: Implements both traditional ML (Gradient Boosting) and BERT-based deep learning approaches
- 🧠 **Intelligent Text Analysis**: Uses NLP techniques to extract relevant features from email content
- 🔍 **High Detection Accuracy**: Achieves reliable classification with low false positive rates
- 🖥️ **User-Friendly Web Interface**: Intuitive design for seamless email analysis
- ⚡ **Real-Time Feedback**: Provides instant classification results with confidence scores
- 📊 **Visual Risk Assessment**: Displays confidence metrics with intuitive visual indicators

## 🛠️ Technical Architecture
The system follows a modular architecture:

![System Architecture](media/image1.png)

### Components:
- **Frontend**: Responsive web interface built with HTML, CSS and JavaScript
- **Backend API**: FastAPI-based server handling prediction requests
- **ML Pipeline**: Text preprocessing, feature extraction, and model training components
- **Models**: 
  - Traditional ML model using TF-IDF and custom feature extraction
  - BERT-based deep learning model for enhanced accuracy

## 💻 Technologies Used
- **Programming Languages**: Python 3.x, JavaScript
- **Backend Framework**: FastAPI
- **Machine Learning**: scikit-learn, PyTorch, Transformers (BERT)
- **Frontend**: HTML5, CSS3, TailwindCSS
- **Data Processing**: pandas, NumPy
- **Text Processing**: NLTK, TF-IDF Vectorization
- **Deployment**: Uvicorn (ASGI server)

## 📋 Project Structure
```
phishing-email-detection/
├── app.py                  # FastAPI server implementation
├── index.html              # Frontend web interface
├── train_model.py          # Traditional ML model training
├── bert_model.py           # BERT model training script
├── create_dataset.py       # Dataset generation script
├── requirements.txt        # Python dependencies
├── backend/                # Model artifacts directory
│   ├── model.pkl           # Trained ML model
│   ├── vectorizer.pkl      # TF-IDF vectorizer
│   └── bert_model/         # BERT model files
└── data/                   # Dataset directory
    └── emails.csv          # Email dataset
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/phishing-email-detection.git
   cd phishing-email-detection
   ```

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Generate the dataset (optional, you can use your own dataset):
   ```bash
   python create_dataset.py
   ```

4. Train the models:
   ```bash
   python train_model.py    # For traditional ML model
   python bert_model.py     # For BERT model (requires more compute)
   ```

5. Run the application:
   ```bash
   uvicorn app:app --reload
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```
   Or open the `index.html` file directly in your browser.

## 📊 Model Performance
The system utilizes two complementary machine learning approaches:

1. **Gradient Boosting Classifier**:
   - Features: TF-IDF vectors + custom email features (link count, urgent language, etc.)
   - Performance: ~95% accuracy on test data

2. **BERT Model** (optional enhanced model):
   - Leverages transformer-based deep learning for nuanced text understanding
   - Performance: ~97% accuracy on test data

## 🔬 How It Works
1. **Email Preprocessing**: Cleans and normalizes raw email text
2. **Feature Extraction**: 
   - TF-IDF vectors capture important words/phrases
   - Custom features detect suspicious patterns (urgent language, suspicious domains, etc.)
3. **Classification**: ML models predict if an email is phishing or legitimate
4. **Confidence Score**: Provides probability estimate of the classification
5. **User Feedback**: Visual indication of the result along with detailed insights

## 🌟 Usage Examples
1. **Checking a Suspicious Email**:
   - Copy the full email content (including subject line)
   - Paste into the web interface
   - Click "Check Email" to see the classification result

2. **API Integration** (for developers):
   ```python
   import requests
   
   email_text = "Subject: URGENT action required...\n\nDear user, your account will be suspended..."
   
   response = requests.post(
       "http://localhost:8000/predict",
       json={"email": email_text}
   )
   
   result = response.json()
   print(f"Prediction: {result['prediction']}")
   print(f"Confidence: {result['confidence']:.2f}")
   ```

## 📝 Project Scope
The current implementation:
- ✅ Analyzes email text content (subject and body)
- ✅ Provides classification with confidence scores
- ✅ Offers web-based UI and API access

Not included in current scope:
- ❌ Analysis of email attachments or embedded images
- ❌ URL sandbox analysis or domain reputation checking
- ❌ Email header analysis (SPF, DKIM, DMARC)
- ❌ Real-time email gateway integration

## 👥 Authors
- **Abubakar Mahmood**
- **Muhammad Arshad Ali**
- **Mohid Usman**

## 👨‍🏫 Lecturer
**Kanwal Naz**

## 📋 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Resources
- [Kaggle Phishing Emails Dataset](https://www.kaggle.com/datasets/subhajournal/phishingemails)
- [BERT for Text Classification](https://huggingface.co/blog/bert-text-classification)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)