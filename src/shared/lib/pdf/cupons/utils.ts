export function cleanSpaces(str: string): string {
  return str.replace(/&nbsp;/g, '')
}

export function includeSpace(qty: number) {
  // return '&nbsp;'.repeat(qty);
  if (qty > 0) {
    return ' '.repeat(qty);
  } else {
    return ''
  }
}

export function centralizeText(text: string, maxCharLine = 43): string {
  const qtySpaces = (maxCharLine - text.length) / 2;
  return `${includeSpace(qtySpaces)}${text}${includeSpace(qtySpaces)}`;
}

export function alingRightText(text: string, maxCharLine = 43) {
  const qtySpaces = maxCharLine - Number(text.replace(/&nbsp;/g, ' ').length);
  return `${includeSpace(qtySpaces)}${text}`;
}

export function justifiyText(textLeft: string, textRight: string, maxCharLine = 43) {
  const textLeftCount = Number(cleanSpaces(textLeft).length)
  const textRightCount = Number(cleanSpaces(textRight).length);
  let qtySpaces = 0

  qtySpaces = maxCharLine - (textLeftCount + textRightCount);
  if (qtySpaces < 0) {
    qtySpaces = maxCharLine - (textLeftCount + 17);
  }

  return `${textLeft}${includeSpace(qtySpaces)}${textRight}`;
}

export function formatProductsHeader() {
  const itemField = 'Item';
  const qtdField = 'Qtd';
  const vlUnitField = 'Vl Unit.';
  const vlTotalField = 'Vl Total';
  return `${itemField}${includeSpace(13)}${qtdField}${includeSpace(2)}${vlUnitField}${includeSpace(2)}${vlTotalField}`;
}

export function formatAmount(amount: string, maxCharAmount = 6) {
  const qtySpaces = maxCharAmount - Number(amount.length);
  return `R$${includeSpace(qtySpaces)}${amount}`;
}

export function formatAddress(addressText: string, addressLabelLength = 0, maxCharLine = 43) {
  const lines = [];
  let currentAddressCharacters = 0
  let currentLine = 0

  while (true) {
    if (currentAddressCharacters >= addressText.length) {
      break;
    }
        
    const referenceAddres = addressText.substr(currentAddressCharacters)
    const lineLimit = currentLine === 0 ? (maxCharLine - addressLabelLength) : maxCharLine
    const currentContent = referenceAddres.substr(0, lineLimit)
    lines[currentLine] = currentContent
    currentAddressCharacters += currentContent.length
    currentLine+= 1
  }

  // return lines.join("<br />")
  // return lines.join("\n    ")
  return lines.join("\n")
}
