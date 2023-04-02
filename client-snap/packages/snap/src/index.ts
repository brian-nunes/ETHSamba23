import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text,  } from '@metamask/snaps-ui';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'send_signature':
        return (
          snap.request({
            method: 'snap_dialog',
            params: {
              type: 'Confirmation',
              content: panel([
                text(`${JSON.stringify(request)}\n\n Deseja assinar o contrato em: ${request}?\nCuidado ao efetuar esta operação!`),
              ]),
            },
          }));
    default:
      throw new Error('Method not found.');
  }
};
