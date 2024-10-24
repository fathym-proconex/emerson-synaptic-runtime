import {
  CircuitConfiguration,
  CircuitContext,
  EaCDynamicToolDetails,
  EaCToolNeuron,
} from '@fathym/synaptic';
import { z } from 'npm:zod';

export const Configure: CircuitConfiguration<'Linear'> = (
  _ctx: CircuitContext,
) => {
  return {
    AIaC: {
      Tools: {
        simple: {
          Details: {
            Type: 'Dynamic',
            Name: 'simple',
            Description: 'Use this tool as a simple example.',
            Schema: z.object({ Value: z.string() }),
            Action: ({ Value }: { Value: string }) => {
              return Promise.resolve(`Tool Processed: ${Value}`);
            },
          } as EaCDynamicToolDetails,
        },
      },
    },
    Type: 'Linear',
    Name: 'Core Test Circuit',
    Description: 'A simple test circuit',
    IsCallable: true,
    InputSchema: z.object({
      Input: z
        .string()
        .describe('The input value from a user, for the circuit.'),
    }),
    Neurons: {
      '': {
        Type: 'Tool',
        ToolLookup: 'core|simple',
        BootstrapInput: ({ Input }: { Input: string }) => {
          return { Value: Input };
        },
        BootstrapOutput: (output: string) => {
          return { Result: output };
        },
      } as EaCToolNeuron,
    },
  };
};
