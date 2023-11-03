/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ArticulationInformationCreateFormInputValues = {
    college?: number;
    assistKey?: number;
};
export declare type ArticulationInformationCreateFormValidationValues = {
    college?: ValidationFunction<number>;
    assistKey?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ArticulationInformationCreateFormOverridesProps = {
    ArticulationInformationCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    college?: PrimitiveOverrideProps<TextFieldProps>;
    assistKey?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ArticulationInformationCreateFormProps = React.PropsWithChildren<{
    overrides?: ArticulationInformationCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ArticulationInformationCreateFormInputValues) => ArticulationInformationCreateFormInputValues;
    onSuccess?: (fields: ArticulationInformationCreateFormInputValues) => void;
    onError?: (fields: ArticulationInformationCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ArticulationInformationCreateFormInputValues) => ArticulationInformationCreateFormInputValues;
    onValidate?: ArticulationInformationCreateFormValidationValues;
} & React.CSSProperties>;
export default function ArticulationInformationCreateForm(props: ArticulationInformationCreateFormProps): React.ReactElement;
