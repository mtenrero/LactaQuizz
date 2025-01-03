//datos_2024-09-20.ts
export default function cleanName(code: string): string {
    const semiclean = code
        .replace('datos', '')
        .replace('.json', '')
        .replace('_', '')
        .split('-')

    const final = `${semiclean[2]}-${semiclean[1]}-${semiclean[0]}`
    return final
}