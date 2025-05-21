import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from './logo.png';

const Quiz = () => {
  const { type } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');
  const course = queryParams.get('course');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 minutes (in seconds)
  const [downLoadCert, setDownLoadCert] = useState(false);
  const [progressHistory, setProgressHistory] = useState([]);
  const [showCertPreview, setShowCertPreview] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const certificateRef = useRef(null);

  useEffect(() => {
    // axios.get(`http://localhost:3005/api/questions?type=${type}`)
    axios.get(`https://eschoolbackend2.vercel.app/api/questions?type=${type}`)
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  }, [type]);

  // Timer logic 
  useEffect(() => {
    if (isFinished || questions.length === 0) return;

    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, questions]);

  // Check for passed or failed status
  useEffect(() => {
    if (isFinished) {
      score >= (questions.length / 2) ? setDownLoadCert(true) : setDownLoadCert(false);
    }
  }, [isFinished, score, questions.length]);

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const nth = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  return `${day}${nth(day)} ${month}, ${year}`;
};
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  const generateCertificate = async () => {
    if (!certificateRef.current || isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const element = certificateRef.current;
      const originalOpacity = element.style.opacity;
      element.style.opacity = '1'; // Ensure full visibility for capture

      // Create canvas with higher quality
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0
      });

      // Calculate PDF dimensions (A4 landscape)
      const imgWidth = 297; // A4 width in mm (landscape)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`${name}_${course}_certificate.pdf`);
      
      // Restore original style
      element.style.opacity = originalOpacity;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Track history of candidate answers
    setProgressHistory(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: selectedOption,
        correct: currentQuestion.correctAnswer,
        explanation: currentQuestion.Explanation,
        status: isCorrect ? 'Pass' : 'Fail'
      }
    ]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption('');
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) return <p>Welcome, {name}! <p>Loading questions...</p></p>;

  if (isFinished) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Quiz Completed</h2>
        <p style={styles.score}>Your Score: {score} / {questions.length}</p>

        <button onClick={() => setShowHistory(!showHistory)} style={styles.toggleButton}>
          {showHistory ? 'Hide Progress History' : 'Show Progress History'}
        </button>

        {showHistory && (
          <div style={styles.historyContainer}>
            <h4>Progress History</h4>
            <ul style={styles.historyList}>
              {progressHistory.map((item, idx) => (
                <li key={idx} style={styles.historyItem}>
                  <strong>Q:</strong> {item.question} <br />
                  <strong>Your Answer:</strong> {item.selected} |{" "}
                  <strong>Correct:</strong> {item.correct} |{" "}
                  <strong>Status:</strong>{" "}
                  <span style={{ color: item.status === 'Pass' ? 'green' : 'red' }}>
                    {item.status}
                  </span><br />
                  <strong>Explanation:</strong> {item.explanation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {downLoadCert && (
          <div style={styles.certificateSection}>
            <button 
              onClick={() => setShowCertPreview(prev => !prev)}
              style={styles.toggleButton}
            >
              {showCertPreview ? 'Hide Certificate Preview' : 'Show Certificate Preview'}
            </button>

            {showCertPreview && (
              <div id="certificate" ref={certificateRef} style={styles.certificate}>
                <div style={styles.certificateWatermark}></div>
                <div style={styles.certificateContent}>
                  <div style={styles.certificateHeader}>
                    <div style={styles.logoContainer}>
                      <img
                        src={logo}
                        alt="School Logo"
                        style={styles.logoImage}
                      />
                      <div>
                        <h2 style={styles.schoolName}>OHAFIA MICROFINANCE BANK</h2>
                        <h3 style={styles.schoolSubtitle}>TRAINING CENTRE</h3>
                      </div>
                    </div>
                    <p style={styles.schoolAddress}>122 Arochukwu Road, Amaekpu-Ohafia</p>
                  </div>

                  <div style={styles.certificateTitle}>
                    <h1 style={styles.certificateTitleText}>
                      Certificate of Completion
                      <span style={styles.titleUnderline}></span>
                    </h1>
                  </div>

                  <div style={styles.certificateBody}>
                    <p style={styles.certificateText}>
                      This is to certify that
                    </p>
                    <h2 style={styles.certificateName}>
                      {name.toUpperCase()}
                    </h2>
                    <p style={styles.certificateText}>
                      has successfully completed the <strong>{course.toUpperCase()}</strong> training program
                      with a final score of <strong>{score}/{questions.length}</strong>.
                    </p>
                  </div>

                  <div style={styles.signaturesSection}>
                    <div style={styles.signatureLine}>
                     <div>{formatDate(new Date())}</div>
                      <div style={styles.signatureUnderline}></div>
                      <p style={styles.signatureLabel}>Date</p>
                    </div>
                    <div style={styles.signatureLine}>
                      <div style={styles.signatureUnderline}></div>
                      <p style={styles.signatureLabel}>Training Director</p>
                    </div>
                  </div>

                  <div style={styles.officialSeal}>
                    <span style={styles.sealText}>OFFICIAL SEAL</span>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={generateCertificate} 
              disabled={isGeneratingPDF}
              style={{
                ...styles.downloadButton,
                backgroundColor: isGeneratingPDF ? '#ccc' : '#28a745'
              }}
            >
              {isGeneratingPDF ? 'Generating...' : 'Download Certificate'}
            </button>
          </div>
        )}
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div>
      <div style={styles.headerBar}>
        <div style={styles.scoreBox}>Score: <strong>{score}</strong><p>CBT on: <strong>{course}</strong></p></div>
        <h2 style={styles.title}>CERTIFIED INFORMATION SYSTEM SECURITY PROFESSIONAL (CISSP)</h2>
        <div style={styles.timerBox}>Time Left: <strong>{formatTime(timeLeft)}</strong><p style={{ color: '#BAF123' }}><strong>{name}</strong></p></div>
      </div>

      <h1 style={styles.domainTitle}>
        CISSP Domain Quiz - {
          type.toUpperCase() === 'DOMAIN1' ? 'Domain 1: Security and Risk Management' :
            type.toUpperCase() === 'DOMAIN2' ? 'Domain 2: Asset Security' :
              type.toUpperCase() === 'DOMAIN3' ? 'Domain 3: Security Architecture and Engineering' :
                type.toUpperCase() === 'DOMAIN4' ? 'Domain 4: Communication and Network Security' :
                  type.toUpperCase() === 'DOMAIN5' ? 'Domain 5: Identity and Access Management (IAM)' :
                    type.toUpperCase() === 'DOMAIN6' ? 'Domain 6: Security Assessment and Testing' :
                      type.toUpperCase() === 'DOMAIN7' ? 'Domain 7: Security Operations' :
                        type.toUpperCase() === 'DOMAIN8' ? 'Domain 8: Software Development Security' : 'OHAFIA MFB COMPUTER BASED TEST'
        }
      </h1>

      <div style={styles.container}>
        <h3 style={styles.questionCount}>Question {currentIndex + 1}</h3>
        <p style={styles.questionText}>{question.question}</p>

        {['A', 'B', 'C', 'D'].map(letter => (
          <div key={letter} style={styles.optionContainer}>
            <label style={styles.label}>
              <input
                type="radio"
                name="option"
                value={letter}
                checked={selectedOption === letter}
                onChange={() => setSelectedOption(letter)}
                style={styles.radio}
              />
              {question[`option${letter}`]}
            </label>
          </div>
        ))}

        <div style={styles.buttonRow}>
          <button
            disabled={!selectedOption}
            onClick={handleNext}
            style={{
              ...styles.button,
              backgroundColor: !selectedOption ? '#ccc' : '#007bff',
              cursor: !selectedOption ? 'not-allowed' : 'pointer',
            }}
          >
            {currentIndex + 1 === questions.length ? 'Finish' : 'Next'}
          </button>

          {type !== 'cbt' && <button
            onClick={() => setShowAnswer(!showAnswer)}
            style={styles.secondaryButton}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>}
        </div>

        {showAnswer && type !== 'cbt' && (
          <div style={styles.answerBox}>
            <strong>Answer:</strong> {question.correctAnswer} <br />
            <em>{question.Explanation}</em>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '700px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    color: '#222',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: '20px',
    fontSize: '20px'
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
    color: '#004085',
    marginBottom: '20px'
  },
  questionCount: {
    color: '#333',
    fontSize: '18px',
    marginBottom: '10px'
  },
  questionText: {
    fontSize: '18px',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  optionContainer: {
    marginBottom: '12px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  label: {
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  radio: {
    marginRight: '10px',
    transform: 'scale(1.2)'
  },
  buttonRow: {
    marginTop: '25px',
    display: 'flex',
    gap: '15px'
  },
  button: {
    padding: '12px 25px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  secondaryButton: {
    padding: '12px 25px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  answerBox: {
    marginTop: '25px',
    backgroundColor: '#e2f0d9',
    padding: '15px',
    borderLeft: '5px solid #28a745',
    borderRadius: '5px',
    fontSize: '16px'
  },
  score: {
    fontSize: '22px',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#f1f1f1',
    borderBottom: '1px solid #ccc',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  scoreBox: {
    fontSize: '16px',
    color: '#333',
    minWidth: '120px'
  },
  timerBox: {
    fontSize: '16px',
    color: '#d9534f',
    minWidth: '120px',
    textAlign: 'right'
  },
  domainTitle: {
    textAlign: 'center',
    color: '#1a1a1a',
    margin: '20px 0',
    fontSize: '20px',
    padding: '0 20px'
  },
  toggleButton: {
    padding: '10px 20px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    margin: '10px 0'
  },
  historyContainer: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  historyList: {
    listStyleType: 'none',
    padding: 0
  },
  historyItem: {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    borderLeft: '4px solid #6c757d'
  },
  certificateSection: {
    marginTop: '30px',
    textAlign: 'center'
  },
  downloadButton: {
    padding: '12px 25px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s'
  },
  certificate: {
    width: '800px',
    minHeight: '600px',
    margin: '20px auto',
    padding: '40px',
    border: '15px double #1a3e72',
    backgroundColor: '#f9f9f9',
    position: 'relative',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    fontFamily: "'Times New Roman', serif",
    textAlign: 'center',
    backgroundImage: 'none',
    backgroundSize: '40%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundBlendMode: 'luminosity'
  },
  certificateWatermark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'inherit',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    opacity: 0.05,
    zIndex: 0,
    pointerEvents: 'none'
  },
  certificateContent: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  certificateHeader: {
    marginBottom: '30px'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px'
  },
  logoImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    marginRight: '20px',
    borderRadius:'85%'
  },
  schoolName: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a3e72',
    letterSpacing: '1px'
  },
  schoolSubtitle: {
    margin: '5px 0 0',
    fontSize: '18px',
    fontWeight: 'normal',
    color: '#333'
  },
  schoolAddress: {
    margin: '5px 0 30px',
    fontSize: '12px',
    color: '#555'
  },
  certificateTitle: {
    margin: '20px 0'
  },
  certificateTitleText: {
    margin: 0,
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1a3e72',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    position: 'relative',
    display: 'inline-block'
  },
  titleUnderline: {
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '3px',
    backgroundColor: '#d4af37'
  },
  certificateBody: {
    margin: '30px 0',
    padding: '0 50px'
  },
  certificateText: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#333'
  },
  certificateName: {
    margin: '15px 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a3e72',
    textDecoration: 'underline',
    textDecorationColor: '#d4af37',
    textDecorationThickness: '2px'
  },
  signaturesSection: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '50px'
  },
  signatureLine: {
    textAlign: 'center'
  },
  signatureUnderline: {
    height: '1px',
    width: '150px',
    backgroundColor: '#333',
    margin: '0 auto 10px'
  },
  signatureLabel: {
    margin: '5px 0',
    fontSize: '14px'
  },
  officialSeal: {
    position: 'absolute',
    bottom: '40px',
    right: '40px',
    width: '80px',
    height: '80px',
    border: '2px solid #d4af37',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)'
  },
  sealText: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#1a3e72',
    textAlign: 'center'
  }
};

export default Quiz;