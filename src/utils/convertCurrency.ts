/**
 * 
 * Converte um valor monetário em reais (BRL) para centavos.
 * @param {string} amount - O valor monetário em reais (BRL) a ser convertido.
 * @returns {number} O valor convetidos em centavos.
 * 
 * @example
 * converRealToCents("1.300,50"); // Retorna: 130050 cents
 */
export function convertRealToCents(amount: string) {
  const numericPrice = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
  const priceInCents = Math.round(numericPrice * 100)

  return priceInCents;
}