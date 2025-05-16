import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Quiz = () => {
    const { type } = useParams(); 
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [descriptiveType, setDescriptiveType] = useState('');
    const [score, setScore] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60*30); // 30 minutes (in seconds)
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
     
        axios.get(`http://localhost:3005/api/questions?type=${type}`)
            .then(res => setQuestions(res.data))
            .catch(err => console.error(err));
    }, []);

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
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };
    const handleNext = () => {
        const currentQuestion = questions[currentIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption('');
            setShowAnswer(false);
        } else {
            setIsFinished(true);
        }
    };

    if (questions.length === 0) return <p>Loading questions...</p>;

    if (isFinished) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Quiz Completed</h2>
                <p style={styles.score}>Your Score: {score} / {questions.length}</p>
            </div>
        );
    }

    const question = questions[currentIndex];

    return (
        <div>
            <div style={styles.headerBar}>
                <div style={styles.scoreBox}>Score: <strong>{score}</strong></div>
                <h2 style={styles.title}>CERTIFIED INFORMATION SYSTEM SECURITY PROFESSIONAL (CISSP)</h2>
                <div style={styles.timerBox}>Time Left: <strong>{formatTime(timeLeft)}</strong></div>
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
                    type.toUpperCase() === 'DOMAIN8' ? 'Domain 8: Software Development Security' : 'Unknown Domain'
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
    
                    <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        style={styles.secondaryButton}
                    >
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </button>
                </div>
    
                {showAnswer && (
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
        marginBottom: '20px'
    },
    heading: {
        textAlign: 'center',
        fontSize: '28px',
        color: '#004085'
    },
    questionCount: {
        color: '#333'
    },
    questionText: {
        fontSize: '18px',
        marginBottom: '15px'
    },
    optionContainer: {
        marginBottom: '10px'
    },
    label: {
        fontSize: '16px',
        cursor: 'pointer'
    },
    radio: {
        marginRight: '8px'
    },
    buttonRow: {
        marginTop: '20px',
        display: 'flex',
        gap: '10px'
    },
    button: {
        padding: '10px 20px',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s'
    },
    secondaryButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    answerBox: {
        marginTop: '20px',
        backgroundColor: '#e2f0d9',
        padding: '10px',
        borderLeft: '5px solid #28a745',
        borderRadius: '5px'
    },
    score: {
        fontSize: '20px',
        color: '#333',
        textAlign: 'center'
    },
    headerBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 30px',
        backgroundColor: '#f1f1f1',
        borderBottom: '1px solid #ccc',
        position: 'sticky',
        top: 0,
        zIndex: 10
    },
    scoreBox: {
        fontSize: '16px',
        color: '#333'
    },
    timerBox: {
        fontSize: '16px',
        color: '#d9534f' // red shade for urgency
    },
    domainTitle: {
        textAlign: 'center',
        color: '#1a1a1a',
        margin: '20px 0',
        fontSize: '20px'
    }
    
};

export default Quiz;








  
  
  


  
