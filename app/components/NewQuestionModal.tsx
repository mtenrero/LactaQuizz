import { Modal, TextInput, Button, Checkbox } from "@mantine/core"
import { Tests } from "@prisma/client"
import { useEffect, useState } from "react"
import { showNotification } from "@mantine/notifications"


interface NewQuestionModalProps {
    group: string;
    isModalOpened: boolean;
    handleUpdate: Function
}

const initialState: Tests = {
    id: '',
    answer: 0,
    answer_A: '',
    answer_B: '',
    answer_C: '',
    answer_D: '',
    answer_E: '',
    answer_F: '',
    corrected: false,
    image_name: '',
    question: '',
    source_file: '',
    uncertain: false,
}

const NewQuestionModal: React.FC<NewQuestionModalProps> = ({ group, isModalOpened, handleUpdate }) => {
    const [modalOpened, setModalOpened] = useState(isModalOpened || false)
    const [newQuestion, setNewQuestion] = useState<Tests>(initialState)

    const handleNewQuestionChange = (field: keyof Tests, value: string | number | boolean) => {
        setNewQuestion({ ...newQuestion, [field]: value })
    }

    useEffect(() => {
        setModalOpened(isModalOpened)
    }, [isModalOpened])


    const handleNewQuestionSubmit = () => {
        if (JSON.stringify(newQuestion) === JSON.stringify(initialState)) {
            handleUpdate(null)
        } else {
            handleUpdate(newQuestion)
        }
    }

    const handleClose = () => { 
        handleUpdate(null)
    }

    return (
        <>
            <Modal
                opened={modalOpened}
                onClose={() => handleUpdate()}
                title="Nueva Pregunta"
            >
                <TextInput
                    label="Pregunta"
                    value={newQuestion.question}
                    onChange={(e) => handleNewQuestionChange('question', e.target.value)}
                />
                <TextInput
                    label="Nombre de la imagen"
                    value={newQuestion.image_name}
                    onChange={(e) => handleNewQuestionChange('image_name', e.target.value)}
                />
                {['A', 'B', 'C', 'D', 'E', 'F'].map((option) => (
                    <div key={option} style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                            name="correctAnswer"
                            checked={newQuestion.answer === option.charCodeAt(0) - 64}
                            onChange={() => handleNewQuestionChange('answer', option.charCodeAt(0) - 64)}
                            style={{ marginRight: '8px' }}
                        />
                        <TextInput
                            label={`Respuesta ${option}`}
                            value={newQuestion[`answer_${option}` as keyof Tests] as string || ''}
                            onChange={(e) => handleNewQuestionChange(`answer_${option}` as keyof Tests, e.target.value)}
                        />
                    </div>
                ))}
                <Button onClick={handleNewQuestionSubmit}>Guardar</Button>
            </Modal>
        </>
    )
}

export default NewQuestionModal