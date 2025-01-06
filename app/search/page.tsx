'use client';

import React, { useState } from 'react';
import {
  TextInput,
  Button,
  Paper,
  Title,
  Text,
  List,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { IconSearch, IconAlertTriangle, IconCheck } from '@tabler/icons-react';

interface SearchResult {
  item: {
    id: string;
    question: string;
    answer: number;
    answer_A: string;
    answer_B: string;
    answer_C: string;
    answer_D: string;
    answer_E: string | null;
    answer_F: string | null;
    uncertain: boolean | null;
  };
  score: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<SearchResult | null>(null);

  const handleSearch = async () => {
    setSelectedQuestion(null);
    try {
      const response = await fetch(`/api/fulltext?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      // Sort ascending by score (adjust to descending if needed)
      setResults(data.sort((a: SearchResult, b: SearchResult) => a.score - b.score));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Box p="xl">
      <Paper shadow="xs" p="md" withBorder>
      <Title order={2} mb="md">
        Búsqueda de Preguntas
      </Title>
      <Box mb="lg" style={{ display: 'flex', gap: '1rem' }}>
        <TextInput
        placeholder="Ingrese su búsqueda"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
          handleSearch();
          }
        }}
        style={{ flex: 1 }}
        />
        <Button onClick={handleSearch}>
        Buscar
        </Button>
      </Box>
      </Paper>

      {selectedQuestion && (
      <Paper shadow="xs" mt="xl" p="md" withBorder>
        <Title order={3} mb="md">
        Detalle de la Pregunta
        </Title>
        <Text mb="md" fw="bold">{selectedQuestion.item.question}</Text>

        {selectedQuestion.item.uncertain && (
        <Box mb="md" p="xs" style={{ backgroundColor: 'yellow', borderRadius: '4px' }}>
          <Text>
          <ThemeIcon color="yellow" size={24} radius="xl">
            <IconAlertTriangle size={16} />
          </ThemeIcon>{' '}
          Pregunta no verificada
          </Text>
        </Box>
        )}

        <List spacing="xs">
        {['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => {
          const answerKey = `answer_${letter}` as keyof typeof selectedQuestion.item;
          const answer = selectedQuestion.item[answerKey];

          if (answer) {
          const isCorrect =
            selectedQuestion.item.answer === ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(letter) + 1;

          return (
            <List.Item
            key={letter}
            icon={
              isCorrect ? (
              <ThemeIcon color="green" size={24} radius="xl">
                <IconCheck size={16} />
              </ThemeIcon>
              ) : undefined
            }
            style={
              isCorrect
              ? { backgroundColor: 'lightgreen', padding: '8px', borderRadius: '4px' }
              : undefined
            }
            >
            <Text>
              {letter}: {answer}
            </Text>
            </List.Item>
          );
          }

          return null;
        })}
        </List>
      </Paper>
      )}

      {results.length > 0 && (
      <Paper shadow="xs" mt="xl" p="md" withBorder>
        <Title order={3} mb="md">
        Resultados
        </Title>
        <List spacing="xs">
        {results.map((result) => (
          <List.Item
          key={result.item.id}
          onClick={() => setSelectedQuestion(result)}
          style={{ cursor: 'pointer' }}
          >
          <Text fw={selectedQuestion?.item.id === result.item.id ? 'bold' : 'normal'}>
            {result.item.question}
          </Text>
          <Text size="sm" color="dimmed">
            Score: {result.score.toFixed(4)}
          </Text>
          </List.Item>
        ))}
        </List>
      </Paper>
      )}
    </Box>
  );
}
