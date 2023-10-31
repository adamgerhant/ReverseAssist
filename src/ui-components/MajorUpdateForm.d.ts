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
export declare type MajorUpdateFormInputValues = {
    name?: string;
};
export declare type MajorUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MajorUpdateFormOverridesProps = {
    MajorUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MajorUpdateFormProps = React.PropsWithChildren<{
    overrides?: MajorUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    major?: any;
    onSubmit?: (fields: MajorUpdateFormInputValues) => MajorUpdateFormInputValues;
    onSuccess?: (fields: MajorUpdateFormInputValues) => void;
    onError?: (fields: MajorUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MajorUpdateFormInputValues) => MajorUpdateFormInputValues;
    onValidate?: MajorUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MajorUpdateForm(props: MajorUpdateFormProps): React.ReactElement;
