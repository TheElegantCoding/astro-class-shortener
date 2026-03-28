type ReplaceClassType = {
  jsFiles: string[];
  cssFiles: string[];
  htmlFiles: string[];
  excludedClasses: string[];
  distributionPath?: string;
  cssJsonMap: Record<string, string>;
};

export type { ReplaceClassType };