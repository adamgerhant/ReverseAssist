/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { API } from "aws-amplify";
import { createArticulationInformation } from "../graphql/mutations";
export default function ArticulationInformationCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    college: "",
    assistKey: "",
  };
  const [college, setCollege] = React.useState(initialValues.college);
  const [assistKey, setAssistKey] = React.useState(initialValues.assistKey);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setCollege(initialValues.college);
    setAssistKey(initialValues.assistKey);
    setErrors({});
  };
  const validations = {
    college: [{ type: "Required" }],
    assistKey: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          college,
          assistKey,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await API.graphql({
            query: createArticulationInformation.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ArticulationInformationCreateForm")}
      {...rest}
    >
      <TextField
        label="College"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={college}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              college: value,
              assistKey,
            };
            const result = onChange(modelFields);
            value = result?.college ?? value;
          }
          if (errors.college?.hasError) {
            runValidationTasks("college", value);
          }
          setCollege(value);
        }}
        onBlur={() => runValidationTasks("college", college)}
        errorMessage={errors.college?.errorMessage}
        hasError={errors.college?.hasError}
        {...getOverrideProps(overrides, "college")}
      ></TextField>
      <TextField
        label="Assist key"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={assistKey}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              college,
              assistKey: value,
            };
            const result = onChange(modelFields);
            value = result?.assistKey ?? value;
          }
          if (errors.assistKey?.hasError) {
            runValidationTasks("assistKey", value);
          }
          setAssistKey(value);
        }}
        onBlur={() => runValidationTasks("assistKey", assistKey)}
        errorMessage={errors.assistKey?.errorMessage}
        hasError={errors.assistKey?.hasError}
        {...getOverrideProps(overrides, "assistKey")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
