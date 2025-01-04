'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import React from 'react'
import { Container, Title, List, ListItem, Loader, Anchor, Group } from '@mantine/core'
import cleanName from '../utils/clean'
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
      }
    }
    fetchFiles()
  }, [])

  if (loading) {
    return <Loader />
  } else {
    return (
      <Container>
        <Title order={1}>Selecciona el tema del test</Title>
        <List>
          {files?.map((file, index) => (
            <ListItem key={index}>
              <Group>
                <Anchor component={Link} href={`/quiz/${file}`}>
                  {getExamTitles(file)} ({file.replace("datos_","").replace(".json", "").replace("2024-", "").split("-").reverse().join("/")})
                </Anchor>
                <Anchor component={Link} href={`/review/${file}`}>
                  ^ Revisar preguntas
                </Anchor>
              </Group>
            </ListItem>
          ))}
        </List>
      </Container>
    )
  }
}
