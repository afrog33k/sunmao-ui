import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Flex,
  Box,
} from '@chakra-ui/react';
import { encodeDragDataTransfer, DROP_EXAMPLE_SIZE_PREFIX } from '@sunmao-ui/runtime';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';

type Props = {
  registry: Registry;
};

export const ComponentList: React.FC<Props> = ({ registry }) => {
  return (
    <Tabs>
      <TabList overflow="auto">
        {Array.from(registry.components.keys()).map(version => (
          <Tab key={version}>{version}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {Array.from(registry.components.keys()).map(version => (
          <TabPanel key={version} overflow="auto">
            <SimpleGrid columns={4} spacing={1}>
              {Array.from(registry.components.get(version)!.values()).map(c => {
                const onDragStart = (e: any) => {
                  e.dataTransfer.setData('component', `${c.version}/${c.metadata.name}`);
                  // pass the exampleSize to gridlayout to render placeholder
                  e.dataTransfer.setData(
                    encodeDragDataTransfer(
                      `${DROP_EXAMPLE_SIZE_PREFIX}${JSON.stringify(
                        c.metadata.exampleSize
                      )}`
                    ),
                    ''
                  );
                };
                const cEle = (
                  <Flex
                    key={c.metadata.name}
                    flexDirection="column"
                    align="center"
                    justify="start"
                  >
                    <Flex
                      className="droppable-element"
                      background="gray.100"
                      width="60px"
                      height="60px"
                      borderRadius="md"
                      align="center"
                      justify="center"
                      transition="ease 0.2s"
                      _hover={{
                        transform: 'scale(1.05)',
                        background: 'gray.200',
                      }}
                      p={2}
                      draggable
                      unselectable="on"
                      onDragStart={onDragStart}
                    >
                      <svg
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2693"
                        width="30"
                        height="30"
                      >
                        <path
                          d="M972.09863 1016.986301H259.506849c-19.638356 0-35.068493-15.430137-35.068493-35.068493V768.70137c-8.416438 5.610959-18.235616 9.819178-28.054794 12.624657h-1.40274c-12.624658 4.208219-26.652055 5.610959-39.276712 5.610959-77.150685 0-138.871233-63.123288-138.871233-138.871233 0-77.150685 63.123288-138.871233 138.871233-138.871232 14.027397 0 28.054795 2.805479 42.082191 7.013698 1.40274 0 2.805479 1.40274 4.20822 1.40274 7.013699 2.805479 14.027397 5.610959 19.638356 8.416438l2.805479 1.40274V269.326027c0-19.638356 15.430137-35.068493 35.068493-35.068493h228.646576l-4.20822-8.416438c-7.013699-11.221918-12.624658-22.443836-15.430137-35.068493v-1.40274c-4.208219-12.624658-5.610959-26.652055-5.610958-39.276712C462.90411 72.942466 526.027397 11.221918 601.775342 11.221918c77.150685 0 138.871233 63.123288 138.871233 138.871233 0 14.027397-2.805479 28.054795-7.013698 42.082191 0 1.40274-1.40274 2.805479-1.40274 4.20822-2.805479 7.013699-5.610959 14.027397-8.416438 19.638356l-7.013699 16.832877h255.29863c19.638356 0 35.068493 15.430137 35.068493 35.068493v314.213698c0 11.221918-5.610959 22.443836-15.430137 29.457535-9.819178 7.013699-22.443836 7.013699-33.665753 2.805479L897.753425 587.747945c-1.40274 0-1.40274-1.40274-2.80548-1.40274-2.805479-1.40274-7.013699-4.208219-11.221918-5.610958h-1.402739c-7.013699-2.805479-14.027397-2.805479-21.041096-2.80548-37.873973 0-68.734247 30.860274-68.734247 68.734247s30.860274 68.734247 68.734247 68.734246c7.013699 0 14.027397-1.40274 19.638356-2.805479 7.013699-1.40274 12.624658-5.610959 18.235616-8.416439 1.40274-1.40274 2.805479-1.40274 4.20822-2.805479l53.304109-25.249315c11.221918-5.610959 23.846575-4.208219 33.665754 1.40274s16.832877 18.235616 16.832876 29.457534V981.917808c0 19.638356-15.430137 35.068493-35.068493 35.068493z m-677.523288-70.136986h642.454795v-182.356164h-1.40274c-11.221918 7.013699-22.443836 12.624658-35.068493 16.832876h-1.40274c-12.624658 4.208219-26.652055 5.610959-39.276712 5.610959-77.150685 0-138.871233-63.123288-138.871233-138.871233 0-77.150685 63.123288-138.871233 138.871233-138.871232 14.027397 0 28.054795 2.805479 42.082192 7.013698 1.40274 0 2.805479 1.40274 4.208219 1.40274 7.013699 2.805479 14.027397 5.610959 19.638356 8.416438l9.819178 4.208219v-224.438356H662.093151c-11.221918 0-22.443836-5.610959-29.457535-15.430137-7.013699-9.819178-7.013699-22.443836-2.805479-33.665753l29.457534-67.331507c0-1.40274 1.40274-1.40274 1.40274-2.805479 1.40274-2.805479 4.208219-7.013699 5.610959-11.221918v-1.40274c2.805479-7.013699 2.805479-14.027397 2.805479-21.041096 0-37.873973-30.860274-68.734247-68.734246-68.734246s-68.734247 30.860274-68.734247 68.734246c0 7.013699 1.40274 14.027397 2.80548 19.638356 1.40274 7.013699 5.610959 12.624658 8.416438 18.235617 1.40274 1.40274 1.40274 2.805479 2.805479 4.208219l28.054795 60.317808c5.610959 11.221918 4.208219 23.846575-1.40274 33.665754s-18.235616 16.832877-29.457534 16.832876H294.575342v274.936987c0 11.221918-5.610959 22.443836-15.430137 29.457534-9.819178 7.013699-22.443836 7.013699-33.665753 2.805479L192.175342 589.150685c-1.40274 0-1.40274-1.40274-2.805479-1.40274-2.805479-1.40274-7.013699-4.208219-11.221918-5.610959h-1.40274c-7.013699-2.805479-14.027397-2.805479-21.041095-2.805479-37.873973 0-68.734247 30.860274-68.734247 68.734246s30.860274 68.734247 68.734247 68.734247c7.013699 0 14.027397-1.40274 19.638356-2.805479 7.013699-1.40274 12.624658-5.610959 18.235616-8.416439 1.40274-1.40274 2.805479-1.40274 4.208219-2.805479l46.290411-22.443836c11.221918-5.610959 23.846575-4.208219 33.665754 1.40274 9.819178 7.013699 16.832877 18.235616 16.832876 29.457534v235.660274z"
                          p-id="2694"
                        ></path>
                      </svg>
                    </Flex>
                    <Box
                      p={2}
                      whiteSpace="pre-wrap"
                      textAlign="center"
                      fontSize="x-small"
                    >
                      {c.metadata.displayName}
                    </Box>
                  </Flex>
                );
                return cEle;
              })}
            </SimpleGrid>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
