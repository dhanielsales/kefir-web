export function onlyNumbers(value: string): string {
  value = String(value);
  return value.replace(/\D/g, '');
}

// 00000-000
export function cepMask(value: string): string {
  const valueOnlyNumbers = onlyNumbers(value);

  // Definindo o tamanho minimo para o CEP
  const cep = valueOnlyNumbers.padStart(8, '0');

  return cep
    .replace(/(\d{2})(\d)/, '$1 $2')
    .replace(/(\d{3})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
    .replace(' ', '');
}

export function capitalize(value: string): string {
  value = String(value);
  return value.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
}

export function amount(value: string): number {
  if (value) {
    return Number(parseFloat(value.replace(/,/g, '.')).toFixed(2))
  }
  return 0
}

// (00) 00000-0000
export function phoneMask(value: string): string {
  const valueOnlyNumbers = onlyNumbers(value);

  if (valueOnlyNumbers.length === 10) {
      return valueOnlyNumbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
      .replace(' ', '');
  } else {  
    return valueOnlyNumbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
      .replace(' ', '');
  }
}