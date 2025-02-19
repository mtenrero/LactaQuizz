'use client'

import { useState, useEffect } from 'react'
import './quiz-editor.css'
import { useParams } from 'next/navigation'
import { Tests } from '@prisma/client'
import Link from 'next/link'
import NewQuestionModal from '../../components/NewQuestionModal'
import { Button, Card } from '@mantine/core'


export default function QuizEditor() {
  const { group } = useParams()
  const [questions, setQuestions] = useState<Tests[]>([])
  const [saved, setSaved] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Tests | null>(null)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newQuestionModalOpened, setNewQuestionModalOpened] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch questions from an API or load from a file
      const fetchQuestions = async () => {
        // This is a placeholder. Replace with actual API call
        const response = await fetch('/api/questions/'+ group)
        const data = await response.json()
        setQuestions(data)
      }

      fetchQuestions()
    }
  }, [isAuthenticated])

  const handleQuestionSelect = (question: Tests) => {
    setSaved(false)
    setDeleted(false)
    setSelectedQuestion(question)
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedQuestion) {
      setSaved(false)
      setDeleted(false)
      const updatedQuestion = { ...selectedQuestion, answer: optionIndex + 1 }
      setSelectedQuestion(updatedQuestion)
      
      // Update the question in the questions array
      const updatedQuestions = questions.map(q => 
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
      setQuestions(updatedQuestions)

      // Here you would typically send an API request to update the question
      // updateQuestion(updatedQuestion)
    }
  }

  const handlePasswordSubmit = () => {
    if (password === 'bgp') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="password-container">
        <Card shadow="sm" padding="lg" style={{ maxWidth: 400, margin: 'auto', marginTop: '20%' }}>
          <h1 style={{color: 'white'}}>Enter Password</h1>
            <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
              handlePasswordSubmit()
              }
            }}
            autoFocus
            />
          <Button onClick={handlePasswordSubmit} style={{ marginTop: '1rem' }}>Submit</Button>
        </Card>
      </div>
    )
  }

  function processNewQuestion(question: Tests): void {
    if (question) {
      console.log(question)
      setQuestions([...questions, question])
      fetch('/api/questions/' + group, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(question),
      })
        .then(response => response.json())
        .then(data => {
          console.log('New question added successfully:', data)
        })
        .catch(error => {
          console.error('Error adding new question:', error)
          alert('NO GUARDADO ERROR!')
        })
    }
    setNewQuestionModalOpened(false)
  }


  function handleNewQuestion(): void {
    setNewQuestionModalOpened(true)
  }


  return (
    <div className="qcontainer">
      <Link href="/">Inicio</Link>
      <h1>Quiz Editor</h1>
      <div className="editor-layout">
        <div className="question-list">
          <h2>Questions</h2>
          <ul>
            {questions.map((question, index) => (
              <li 
                key={question.id} 
                onClick={() => handleQuestionSelect(question)}
                className={selectedQuestion?.id === question.id ? 'selected' : ''}
              >
                {index + 1}. {question.question}
              </li>
            ))}
             <li 
                className='save'
                key="new" 
                onClick={() => handleNewQuestion()}
              >
                NUEVA PREGUNTA
              </li>
          </ul>
        </div>
        {selectedQuestion && (
          <div className="question-editor">
            <h2>Editar Pregunta ({selectedQuestion.image_name})</h2>
            <a href={`https://barvet.es/wp-content/lactaquizz/${selectedQuestion.image_name}`} target="_blank">Ver Captura pregunta original</a>
            <img 
              src={`https://barvet.es/wp-content/lactaquizz/${selectedQuestion.image_name}`}
              alt="Pregunta original" 
              style={{ width: '100%', height: 'auto' }} 
            />
            <textarea
              value={selectedQuestion.question}
              onChange={(e) => {
                const updatedQuestion = { ...selectedQuestion, question: e.target.value }
                setSelectedQuestion(updatedQuestion)

                // Update the question in the questions array
                const updatedQuestions = questions.map(q => 
                  q.id === updatedQuestion.id ? updatedQuestion : q
                )
                setQuestions(updatedQuestions)

                // Here you would typically send an API request to update the question
                // updateQuestion(updatedQuestion)
              }}
              style={{ width: '100%', height: 'auto', fontSize: '1.2rem' }}
              rows={Math.max(3, selectedQuestion.question.split('\n').length)}
            />
            <ul className="options">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((option, index) => (
                <li 
                  key={option}
                  onClick={() => handleOptionSelect(index)}
                  className={selectedQuestion?.answer === index + 1 ? 'correct' : ''}
                  style={{ width: '100%' }}
                >
                  <input
                    type="text"
                    value={selectedQuestion?.[`answer_${option}` as keyof Tests] as string || ''}
                    onChange={(e) => {
                      const updatedQuestion = { 
                        ...selectedQuestion, 
                        [`answer_${option}`]: e.target.value 
                      }
                      setSelectedQuestion(updatedQuestion)

                      // Update the question in the questions array
                      const updatedQuestions = questions.map(q => 
                        q.id === updatedQuestion.id ? updatedQuestion : q
                      )
                      setQuestions(updatedQuestions)

                      // Here you would typically send an API request to update the question
                      // updateQuestion(updatedQuestion)
                    }}
                    style={{ width: '100%', fontSize: '1rem', height: 'auto' }}
                  />
                </li>
                ))}
            </ul>
            <hr />
            <ul className="uncertain">
              <li 
                onClick={() => {
                  if (selectedQuestion) {
                    const updatedQuestion = { ...selectedQuestion, uncertain: !(selectedQuestion.uncertain || false) }
                    setSelectedQuestion(updatedQuestion)


                    // Here you would typically send an API request to update the question
                    // updateQuestion(updatedQuestion)
                  }
                }}
                className={selectedQuestion?.uncertain ? 'uncertain' : ''}
              >
                Respuesta no validada, creo que es esta
              </li>
            </ul>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
              onClick={() => {
                if (selectedQuestion) {
                console.log(selectedQuestion)
                fetch(`/api/update_question/${selectedQuestion.id}`, {
                  method: 'POST',
                  headers: {
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(selectedQuestion),
                })
                  .then(response => response.json())
                  .then(data => {
                  // Update the question in the questions array
                  const updatedQuestions = questions.map(q => 
                    q.id === selectedQuestion.id ? selectedQuestion : q
                  )
                  setQuestions(updatedQuestions)
                  setSaved(true)
                  console.log('Question updated successfully:', data)
                  })
                  .catch(error => {
                  console.error('Error updating question:', error)
                  alert('NO GUARDADO ERROR!')
                  })
                // Here you would typically send an API request to save the question
                // saveQuestion(selectedQuestion)
                }
              }}
              className="save"
              style={{ flex: 1, marginRight: '0.5rem' }}
              >
              Guardar {saved ? '✔️OK' : ''}
              </Button>
              <Button 
              color='red'
              onClick={() => {
                if (selectedQuestion && confirm('Are you sure you want to delete this question?')) {
                console.log(selectedQuestion)
                fetch(`/api/update_question/${selectedQuestion.id}`, {
                  method: 'DELETE',
                })
                  .then(response => response.json())
                  .then(data => {
                  // Remove the deleted question from the questions array
                  const updatedQuestions = questions.filter(q => q.id !== selectedQuestion.id)
                  setQuestions(updatedQuestions)
                  setDeleted(true)
                  console.log('Question deleted successfully:', data)
                  })
                  .catch(error => {
                  console.error('Error deleting question:', error)
                  alert('NO BORRADA ERROR!')
                  })
                }
              }}
              className="delete"
              style={{ flex: 1, marginLeft: '0.5rem' }}
              >
              Borrar {deleted ? '✔️OK' : ''}
              </Button>
            </div>
          </div>
        )}
      </div>
      <NewQuestionModal group={Array.isArray(group) ? group[0] : group || ''} isModalOpened={newQuestionModalOpened} handleUpdate={processNewQuestion} />
    </div>
  )
}
