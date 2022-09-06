/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ParamsValidationTest<T> {
  params: { [P in keyof T]?: any };
  testedVariable: keyof T;
  testDescription: string;
}
