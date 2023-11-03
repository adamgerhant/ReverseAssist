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
import { getCollege } from "../graphql/queries";
import { updateCollege } from "../graphql/mutations";
export default function CollegeUpdateForm(props) {
  const {
    id: idProp,
    college: collegeModelProp,
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
    latitude: "",
    longitude: "",
  };
  const [collegeId, setCollegeId] = React.useState(initialValues.collegeId);
  const [collegeName, setCollegeName] = React.useState(
    initialValues.collegeName
  );
  const [latitude, setLatitude] = React.useState(initialValues.latitude);
  const [longitude, setLongitude] = React.useState(initialValues.longitude);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = collegeRecord
      ? { ...initialValues, ...collegeRecord }
      : initialValues;
    setCollegeId(cleanValues.collegeId);
    setCollegeName(cleanValues.collegeName);
    setLatitude(cleanValues.latitude);
    setLongitude(cleanValues.longitude);
    setErrors({});
  };
  const [collegeRecord, setCollegeRecord] = React.useState(collegeModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await API.graphql({
              query: getCollege.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getCollege
        : collegeModelProp;
      setCollegeRecord(record);
    };
    queryData();
  }, [idProp, collegeModelProp]);
  React.useEffect(resetStateValues, [collegeRecord]);
  const validations = {
    collegeId: [{ type: "Required" }],
    collegeName: [{ type: "Required" }],
    latitude: [{ type: "Required" }],
    longitude: [{ type: "Required" }],
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
          latitude,
          longitude,
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
            query: updateCollege.replaceAll("__typename", ""),
            variables: {
              input: {
                id: collegeRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "CollegeUpdateForm")}
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
              latitude,
              longitude,
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
              latitude,
              longitude,
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
      <TextField
        label="Latitude"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={latitude}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              collegeId,
              collegeName,
              latitude: value,
              longitude,
            };
            const result = onChange(modelFields);
            value = result?.latitude ?? value;
          }
          if (errors.latitude?.hasError) {
            runValidationTasks("latitude", value);
          }
          setLatitude(value);
        }}
        onBlur={() => runValidationTasks("latitude", latitude)}
        errorMessage={errors.latitude?.errorMessage}
        hasError={errors.latitude?.hasError}
        {...getOverrideProps(overrides, "latitude")}
      ></TextField>
      <TextField
        label="Longitude"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={longitude}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              collegeId,
              collegeName,
              latitude,
              longitude: value,
            };
            const result = onChange(modelFields);
            value = result?.longitude ?? value;
          }
          if (errors.longitude?.hasError) {
            runValidationTasks("longitude", value);
          }
          setLongitude(value);
        }}
        onBlur={() => runValidationTasks("longitude", longitude)}
        errorMessage={errors.longitude?.errorMessage}
        hasError={errors.longitude?.hasError}
        {...getOverrideProps(overrides, "longitude")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || collegeModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || collegeModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
