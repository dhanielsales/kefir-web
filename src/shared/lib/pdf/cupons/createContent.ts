import { Client, Order, Trader, Types } from '../types';
import { createTextPlainContent } from './PlainText'

interface CreatePDFProps {
  type?: "plain_text";
  order: Order;
  client: Client;
  trader: Trader;
}

export function createContent({order, client, trader, type = Types.PLAIN_TEXT}: CreatePDFProps) {
  const method = createPdfTypes[type]
  
  const content = method(order, client, trader)

  return content
}

const createPdfTypes = {
  "plain_text": createTextPlainContent
};