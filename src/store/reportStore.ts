import type {
  EstimationInputs, EstimationResult,
  UrbanismeInputs, UrbanismeResult,
  InvestInputs, InvestResult,
  PromoteurInputs, PromoteurResult,
} from '../types'

export interface ReportStore {
  estimation?:   { inputs: EstimationInputs;  result: EstimationResult | null }
  urbanisme?:    { inputs: UrbanismeInputs;   result: UrbanismeResult }
  investisseur?: { inputs: InvestInputs;      result: InvestResult }
  promoteur?:    { inputs: PromoteurInputs;   result: PromoteurResult }
}

const store: ReportStore = {}

export const setReportSection = <K extends keyof ReportStore>(
  key: K,
  val: ReportStore[K],
) => {
  store[key] = val
}

export const getReportData = (): ReportStore => store
