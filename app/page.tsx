'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import React from 'react'
import cleanName from '../utils/clean'

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
    return <div>Loading...</div>
  } else {
    return (
      <div className="container">
        <h1>Selecciona test</h1>
        <ul>
          {files?.map((file, index) => (
            <li key={index}>
              <Link href={`/quiz/${file}`}>{cleanName(file)}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  
}
