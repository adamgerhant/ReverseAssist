/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { fetchByPath, validateField } from "./utils";
import { API } from "aws-amplify";
import { createCollege } from "../graphql/mutations";
export default function CollegeCreateForm(props) {
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
    collegeId: "",
    collegeName: "",
  };
  const [collegeId, setCollegeId] = React.useState(initialValues.collegeId);
  const [collegeName, setCollegeName] = React.useState(
    initialValues.collegeName
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setCollegeId(initialValues.collegeId);
    setCollegeName(initialValues.collegeName);
    setErrors({});
  };
  const validations = {
    collegeId: [{ type: "Required" }],
    collegeName: [{ type: "Required" }],
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
          collegeId,
          collegeName,
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
            query: createCollege.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "CollegeCreateForm")}
      {...rest}
    >
      <TextField
        label="College id"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={collegeId}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              collegeId: value,
              collegeName,
            };
            const result = onChange(modelFields);
            value = result?.collegeId ?? value;
          }
          if (errors.collegeId?.hasError) {
            runValidationTasks("collegeId", value);
          }
          setCollegeId(value);
        }}
        onBlur={() => runValidationTasks("collegeId", collegeId)}
        errorMessage={errors.collegeId?.errorMessage}
        hasError={errors.collegeId?.hasError}
        {...getOverrideProps(overrides, "collegeId")}
      ></TextField>
      <TextField
        label="College name"
        isRequired={true}
        isReadOnly={false}
        value={collegeName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              collegeId,
              collegeName: value,
            };
            const result = onChange(modelFields);
            value = result?.collegeName ?? value;
          }
          if (errors.collegeName?.hasError) {
            runValidationTasks("collegeName", value);
          }
          setCollegeName(value);
        }}
        onBlur={() => runValidationTasks("collegeName", collegeName)}
        errorMessage={errors.collegeName?.errorMessage}
        hasError={errors.collegeName?.hasError}
        {...getOverrideProps(overrides, "collegeName")}
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
