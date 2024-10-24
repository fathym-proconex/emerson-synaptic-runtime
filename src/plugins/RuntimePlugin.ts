import {
  EaCRuntimeConfig,
  EaCRuntimeEaC,
  EaCRuntimePlugin,
  EaCRuntimePluginConfig,
} from '@fathym/eac-runtime';
import { EaCLocalDistributedFileSystemDetails } from '@fathym/eac/dfs';
import { EaCDenoKVDatabaseDetails } from '@fathym/eac/databases';
import {
  EaCSynapticCircuitsProcessor,
  EverythingAsCodeSynaptic,
  FathymSynapticPlugin,
} from '@fathym/synaptic';
import { DefaultMyCoreProcessorHandlerResolver } from './DefaultMyCoreProcessorHandlerResolver.ts';
import { IoCContainer } from '@fathym/ioc';
import SynapticPlugin from './SynapticPlugin.ts';

export default class RuntimePlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig = {
      Name: RuntimePlugin.name,
      Plugins: [
        new SynapticPlugin(),
        new FathymSynapticPlugin(),
      ],
      IoC: new IoCContainer(),
      EaC: {
        Projects: {
          core: {
            Details: {
              Name: 'Sink Micro Applications',
              Description: 'The Kitchen Sink Micro Applications to use.',
              Priority: 100,
            },
            ResolverConfigs: {
              localhost: {
                Hostname: 'localhost',
                Port: config.Server.port || 8000,
              },
              '127.0.0.1': {
                Hostname: '127.0.0.1',
                Port: config.Server.port || 8000,
              },
            },
            ApplicationResolvers: {
              circuits: {
                PathPattern: '/circuits*',
                Priority: 100,
              },
            },
          },
        },
        Applications: {
          circuits: {
            Details: {
              Name: 'Circuits',
              Description: 'The API for accessing circuits',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'SynapticCircuits',
              IsCodeDriven: true,
            } as EaCSynapticCircuitsProcessor,
          },
        },
        AIs: {},
        Circuits: {
          $circuitsDFSLookups: ['local:circuits'],
        },
        Databases: {
          thinky: {
            Details: {
              Type: 'DenoKV',
              Name: 'Thinky',
              Description: 'The Deno KV database to use for thinky',
              DenoKVPath: Deno.env.get('THINKY_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDatabaseDetails,
          },
        },
        DFSs: {
          'local:circuits': {
            Details: {
              Type: 'Local',
              FileRoot: './circuits/',
              Extensions: ['.ts'],
              WorkerPath: import.meta.resolve(
                '@fathym/eac-runtime/workers/local',
              ),
            } as EaCLocalDistributedFileSystemDetails,
          },
        },
      } as EaCRuntimeEaC | EverythingAsCodeSynaptic,
    };

    pluginConfig.IoC!.Register(DefaultMyCoreProcessorHandlerResolver, {
      Type: pluginConfig.IoC!.Symbol('ProcessorHandlerResolver'),
    });

    return Promise.resolve(pluginConfig);
  }
}
