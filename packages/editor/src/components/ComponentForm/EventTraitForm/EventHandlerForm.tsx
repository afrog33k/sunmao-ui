import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Switch,
  VStack,
} from '@chakra-ui/react';
import { Static } from '@sinclair/typebox';
import { CloseIcon } from '@chakra-ui/icons';
import { observer } from 'mobx-react-lite';
import { useFormik } from 'formik';
import { EventHandlerSchema, GLOBAL_UTILS_ID } from '@sunmao-ui/runtime';
import { formWrapperCSS } from '../style';
import { KeyValueEditor } from '../../KeyValueEditor';
import { EditorServices } from '../../../types';
import { ComponentModel } from '../../../AppModel/ComponentModel';
import { AppModel } from '../../../AppModel/AppModel';
import { ComponentId } from '../../../AppModel/IAppModel';

type Props = {
  eventTypes: readonly string[];
  handler: Static<typeof EventHandlerSchema>;
  onChange: (handler: Static<typeof EventHandlerSchema>) => void;
  onRemove: () => void;
  hideEventType?: boolean;
  services: EditorServices;
};

export const EventHandlerForm: React.FC<Props> = observer(props => {
  const { handler, eventTypes, onChange, onRemove, hideEventType, services } = props;
  const { registry, editorStore, appModelManager } = services;
  const { utilMethods } = registry;
  const { components } = editorStore;
  const [methods, setMethods] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: handler,
    onSubmit: values => {
      onChange(values);
    },
  });

  const hasParams = useMemo(
    () => Object.keys(formik.values.method.parameters ?? {}).length,
    [formik.values.method.parameters]
  );
  const params = useMemo(() => {
    const params: Record<string, string> = {};
    const { values } = formik;
    const methodName = values.method.name;

    if (values.method.name) {
      let parameters = {};

      if (handler.componentId === GLOBAL_UTILS_ID) {
        const targetMethod = utilMethods.get(methodName);

        parameters = targetMethod?.parameters?.properties ?? {};
      } else {
        const targetComponent = appModelManager.appModel.getComponentById(
          handler.componentId as ComponentId
        );
        const targetMethod = (targetComponent?.methods ?? []).find(
          ({ name }) => name === formik.values.method.name
        );

        parameters = targetMethod?.parameters?.properties ?? {};
      }

      for (const key in parameters) {
        params[key] = values.method.parameters?.[key] ?? '';
      }
    }

    return params;
  }, [formik.values.method.name]);

  const updateMethods = useCallback(
    (componentId: string) => {
      if (componentId === GLOBAL_UTILS_ID) {
        setMethods(Array.from(utilMethods.keys()));
      } else {
        const component = components.find(c => c.id === componentId);

        if (component) {
          const componentModel = new ComponentModel(
            new AppModel([], registry),
            component,
            registry
          );

          setMethods(componentModel.methods.map(m => m.name));
        }
      }
    },
    [components, registry]
  );

  useEffect(() => {
    formik.setValues(handler);
  }, [handler]);

  useEffect(() => {
    formik.setFieldValue('method.parameters', params);
  }, [params]);

  useEffect(() => {
    if (handler.componentId) {
      updateMethods(handler.componentId);
    }
  }, [handler, updateMethods]);

  const onTargetComponentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMethods(e.target.value);
    formik.handleChange(e);
    formik.setFieldValue('method', { name: '', parameters: {} });
  };

  const typeField = (
    <FormControl>
      <FormLabel>Event Type</FormLabel>
      <Select
        name="type"
        onBlur={() => formik.submitForm()}
        onChange={formik.handleChange}
        placeholder="Select Event Type"
        value={formik.values.type}
      >
        {eventTypes.map(e => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </Select>
    </FormControl>
  );
  const targetField = (
    <FormControl>
      <FormLabel>Target Component</FormLabel>
      <Select
        name="componentId"
        onBlur={() => formik.submitForm()}
        onChange={onTargetComponentChange}
        placeholder="Select Target Component"
        value={formik.values.componentId}
      >
        {[{ id: GLOBAL_UTILS_ID }].concat(components).map(c => (
          <option key={c.id} value={c.id}>
            {c.id}
          </option>
        ))}
      </Select>
    </FormControl>
  );
  const methodField = (
    <FormControl>
      <FormLabel>Method</FormLabel>
      <Select
        name="method.name"
        onBlur={() => formik.submitForm()}
        onChange={formik.handleChange}
        placeholder="Select Method"
        value={formik.values.method.name}
      >
        {methods.map(m => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>
    </FormControl>
  );

  const parametersField = (
    <FormControl>
      <FormLabel>Parameters</FormLabel>
      <KeyValueEditor
        value={formik.values.method.parameters}
        onChange={json => {
          formik.setFieldValue('method.parameters', json);
          formik.submitForm();
        }}
        onlySetValue={true}
      />
    </FormControl>
  );

  const waitTypeField = (
    <FormControl>
      <FormLabel>Wait Type</FormLabel>
      <Select
        name="wait.type"
        onBlur={() => formik.submitForm()}
        onChange={formik.handleChange}
        value={formik.values.wait?.type}
      >
        <option value="delay">delay</option>
        <option value="debounce">debounce</option>
        <option value="throttle">throttle</option>
      </Select>
    </FormControl>
  );

  const waitTimeField = (
    <FormControl>
      <FormLabel>Wait Time</FormLabel>
      <Input
        name="wait.time"
        onBlur={() => formik.submitForm()}
        onChange={formik.handleChange}
        value={formik.values.wait?.time}
      />
    </FormControl>
  );

  const disabledField = (
    <FormControl>
      <FormLabel>Disabled</FormLabel>
      <Switch
        isChecked={formik.values.disabled}
        name="disabled"
        onBlur={() => formik.submitForm()}
        onChange={formik.handleChange}
      />
    </FormControl>
  );

  return (
    <Box position="relative" width="100%">
      <VStack className={formWrapperCSS}>
        {hideEventType ? null : typeField}
        {targetField}
        {methodField}
        {hasParams ? parametersField : null}
        {waitTypeField}
        {waitTimeField}
        {disabledField}
      </VStack>
      <IconButton
        aria-label="remove event handler"
        colorScheme="red"
        icon={<CloseIcon />}
        onClick={onRemove}
        position="absolute"
        right="4"
        size="xs"
        top="4"
        variant="ghost"
      />
    </Box>
  );
});
