/**
 * Devuelve el título o los títulos de examen asociados a un fichero
 * con nombre datos_YYYY-MM-DD.json. Si hay varios exámenes en la misma fecha,
 * se concatenan con '&'.
 *
 * @param filename - Cadena del estilo "datos_2024-09-20.json"
 * @returns Título(s) del/los examen/es o un mensaje si no se encuentra coincidencia
 */
export function getExamTitles(filename: string): string {
    // 1. Mapeo de fechas (YYYY-MM-DD) a lista de títulos de exámenes
    const examMap: Record<string, string[]> = {
      "2024-09-20": ["La importancia de la lactancia materna"],
      "2024-09-22": ["Anatomía y fisiología de la lactancia"],
      "2024-10-06": ["Hipogalactia"],
      "2024-10-08": ["Lactancia en los primeros días"],
      "2024-10-12": [
        "Cólico del lactante",
        "El apego y la lactancia materna"
      ],
      "2024-10-13": ["El papel del Padre-Pareja en la LM"],
      "2024-10-21": [
        "Anujiología y Lactancia Materna",
        "Anatomía y fisiología de la boca del bebé",
        "Métodos de suplementación y Pezoneras"
      ],
      "2024-11-09": [
        "Lactancia en prematuros, el papel de la asesora",
        "Lactancia materna y porteo"
      ],
      "2024-11-10": [
        "Afecciones del pecho",
        "Lactancia en múltiples"
      ],
      "2024-11-16": [
        "Destete",
        "Alimentación complementaria",
        "Mastitis: Tratamiento actualizado"
      ],
      "2024-11-26": [
        "Requisitos Legales de la Asesoría de Lactancia",
        "Historia de la Lactancia Materna",
        "Relactación o inducción a la lactancia",
        "Salud mental perinatal y lactancia",
        "Pérdida gestacional",
        "Lactancia Materna y Sexualidad"
      ],
      "2024-11-30": ["Coaching para asesoras"],
      "2024-12-06": [
        "El Sueño Infantil",
        "Lactancia y alergias alimentarias",
        "Lactancia materna y vuelta al trabajo"
      ],
      "2024-12-20": ["Mecanismos de defensa"]
    };
  
    // 2. Extrae la fecha del nombre del fichero con RegExp
    //    Formato esperado: datos_YYYY-MM-DD.json
    const dateMatch = filename.match(/^datos_(\d{4}-\d{2}-\d{2})\.json$/);
    if (!dateMatch) {
      return `Nombre de fichero no válido: ${filename}`;
    }
    
    const dateKey = dateMatch[1];  // "YYYY-MM-DD"
  
    // 3. Busca los títulos en el examMap
    const titles = examMap[dateKey];
    if (!titles) {
      return `No se encuentran exámenes para la fecha: ${dateKey}`;
    }
  
    // 4. Si existen varios, los unimos con '&'
    return titles.join(" & ");
  }
  
  // Ejemplos de uso:
  console.log(getExamTitles("datos_2024-09-20.json"));
  // => "La importancia de la lactancia materna"
  
  console.log(getExamTitles("datos_2024-10-12.json"));
  // => "Cólico del lactante & El apego y la lactancia materna"
  
  console.log(getExamTitles("datos_2024-12-31.json"));
  // => "No se encuentran exámenes para la fecha: 2024-12-31"
  