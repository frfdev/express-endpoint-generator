function toPascalCase(str) {
  return str
    .split(/[\s_-]+/) // Divide por guiones, guiones bajos o espacios
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

function toCamelCase(str) {
  return str
    .replace(/([A-Z])/g, (match) => match.toLowerCase()) // Normaliza mayúsculas
    .split(/[\s_-]+/) // Divide por espacios, guiones o guiones bajos
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

module.exports = {toPascalCase, toCamelCase}