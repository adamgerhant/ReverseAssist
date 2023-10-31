/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type MajorCreateFormInputValues = {
    name?: string;
};
export declare type MajorCreateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MajorCreateFormOverridesProps = {
    MajorCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MajorCreateFormProps = React.PropsWithChildren<{
    overrides?: MajorCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MajorCreateFormInputValues) => MajorCreateFormInputValues;
    onSuccess?: (fields: MajorCreateFormInputValues) => void;
    onError?: (fields: MajorCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MajorCreateFormInputValues) => MajorCreateFormInputValues;
    onValidate?: MajorCreateFormValidationValues;
} & React.CSSProperties>;
export default function MajorCreateForm(props: MajorCreateFormProps): React.ReactElement;
