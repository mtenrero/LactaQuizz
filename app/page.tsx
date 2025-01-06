'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import React from 'react'
import { Container, Title, List, ListItem, Loader, Anchor, Group, Button } from '@mantine/core'
import { getExamTitles } from '../utils/real_titles'

export default function FileList() {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true)
      try {
        const response = await fetch('/api/files')
        if (!response.ok) {
          throw new Error('Failed to fetch files')
        }
        const data = await response.json()
        setFiles(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching files:', error)
        setLoading(false)
      }
    }
    fetchFiles()
  }, [])

  if (loading) {
    return <Loader />
  } else {
    return (
      <Container style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <Title order={1} style={{ color: 'grey' }}>Selecciona el tema del test</Title>

            <Group style={{ width: '100%', marginBottom: '20px' }}>
          <Button component={Link} href="/search" fullWidth>
            Buscador
          </Button>
        </Group>
          <List>
        {files?.map((file, index) => (
          <ListItem key={index}>
            <Group>
          <Anchor component={Link} href={`/quiz/${file}`}>
            {getExamTitles(file)} ({file.replace("datos_","").replace(".json", "").replace("2024-", "").split("-").reverse().join("/")})
          </Anchor>
            <Anchor component={Link} href={`/review/${file}`}>
            <Button variant="filled" color="blue" size='xs'>
              Revisar preguntas
            </Button>
            </Anchor>
            </Group>
          </ListItem>
        ))}
          </List>
        </div>
      </Container>
    )
  }
}
