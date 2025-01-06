import { CheckIcon } from "@mantine/core"

interface SearchResult {
  item: {
    id: string
    question: string
    answer: number
    answer_A: string
    answer_B: string
    answer_C: string
    answer_D: string
    answer_E: string | null
    answer_F: string | null
  }
  score: number
}

interface SearchResultsProps {
  results: SearchResult[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  const sortedResults = [...results].sort((a, b) => a.score - b.score)

  return (
    <div className="mt-8 space-y-4">
      {sortedResults.map((result) => (
        <details key={result.item.id} className="bg-white shadow rounded-lg p-4">
          <summary className="font-semibold cursor-pointer">
            {result.item.question}
          </summary>
          <div className="mt-4 space-y-2">
            {['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => {
              const answerKey = `answer_${letter}` as keyof typeof result.item
              const answer = result.item[answerKey]
              if (answer) {
                const isCorrect = result.item.answer === ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(letter) + 1
                return (
                  <div
                    key={letter}
                    className={`p-2 rounded-md ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{letter}:</span> {answer}
                    {isCorrect && (
                      <CheckIcon className="inline-block w-5 h-5 ml-2 text-green-500" />
                    )}
                  </div>
                )
              }
              return null
            })}
          </div>
        </details>
      ))}
    </div>
  )
}

