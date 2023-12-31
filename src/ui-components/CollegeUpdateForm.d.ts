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
export declare type CollegeUpdateFormInputValues = {
    collegeId?: number;
    collegeName?: string;
    latitude?: number;
    longitude?: number;
};
export declare type CollegeUpdateFormValidationValues = {
    collegeId?: ValidationFunction<number>;
    collegeName?: ValidationFunction<string>;
    latitude?: ValidationFunction<number>;
    longitude?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CollegeUpdateFormOverridesProps = {
    CollegeUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    collegeId?: PrimitiveOverrideProps<TextFieldProps>;
    collegeName?: PrimitiveOverrideProps<TextFieldProps>;
    latitude?: PrimitiveOverrideProps<TextFieldProps>;
    longitude?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CollegeUpdateFormProps = React.PropsWithChildren<{
    overrides?: CollegeUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    college?: any;
    onSubmit?: (fields: CollegeUpdateFormInputValues) => CollegeUpdateFormInputValues;
    onSuccess?: (fields: CollegeUpdateFormInputValues) => void;
    onError?: (fields: CollegeUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CollegeUpdateFormInputValues) => CollegeUpdateFormInputValues;
    onValidate?: CollegeUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CollegeUpdateForm(props: CollegeUpdateFormProps): React.ReactElement;
