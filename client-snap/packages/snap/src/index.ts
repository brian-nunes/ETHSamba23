import { Json, OnTransactionHandler } from '@metamask/snaps-types';
import { isObject, hasProperty } from '@metamask/utils'
import { panel, text,  } from '@metamask/snaps-ui';

export const onTransactio: OnTransactionHandler = ({ transaction }: any) => {
  const insights: { type: string, params?: Json } = { type: 'Unknown Transaction'}
  if (
    !isObject(transaction) ||
    !hasProperty(transaction, 'data') ||
    typeof transaction.data !== 'string'
  ) {
    console.warn('Unknown Transaction type!');
    return { insights };
  }
  
  return { insights: { foo: "bar"} };
}

