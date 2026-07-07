import { fetchJson } from "@/lib/providers/http";

export type EcbIndicator = {
  id: string;
  label: string;
  unit: string;
  value: number;
  date: string;
};

// ECB Data Portal SDMX series (keyless). flowRef/key pairs.
const SERIES: Array<{ id: string; label: string; unit: string; flow: string; key: string }> = [
  { id: "DFR", label: "ECB Deposit Facility Rate", unit: "%", flow: "FM", key: "B.U2.EUR.4F.KR.DFR.LEV" },
  { id: "MRR", label: "Main Refinancing Rate", unit: "%", flow: "FM", key: "B.U2.EUR.4F.KR.MRR_FR.LEV" },
  { id: "HICP", label: "Euro Area HICP Inflation (YoY)", unit: "%", flow: "ICP", key: "M.U2.N.000000.4.ANR" },
  { id: "EURUSD", label: "EUR/USD Reference Rate", unit: "", flow: "EXR", key: "D.USD.EUR.SP00.A" }
];

const FALLBACK: Record<string, number> = { DFR: 2.0, MRR: 2.15, HICP: 1.9, EURUSD: 1.09 };

type SdmxResponse = {
  dataSets?: Array<{ series?: Record<string, { observations?: Record<string, (number | null)[]> }> }>;
  structure?: { dimensions?: { observation?: Array<{ values?: Array<{ id?: string; name?: string }> }> } };
};

/** Parse the last observation (value + date label) from an SDMX jsondata payload. */
function parseLast(payload: SdmxResponse): { value: number; date: string } | null {
  const series = payload.dataSets?.[0]?.series;
  if (!series) return null;
  const first = Object.values(series)[0];
  const obs = first?.observations;
  if (!obs) return null;
  const keys = Object.keys(obs).sort((a, b) => Number(a) - Number(b));
  const lastKey = keys[keys.length - 1];
  const value = obs[lastKey]?.[0];
  if (value == null) return null;

  const timeValues = payload.structure?.dimensions?.observation?.[0]?.values;
  const date = timeValues?.[Number(lastKey)]?.id ?? timeValues?.[Number(lastKey)]?.name ?? "";
  return { value, date };
}

/** Live European macro indicators from the ECB Data Portal (keyless). */
export async function getEcbIndicators(): Promise<EcbIndicator[]> {
  const results = await Promise.all(
    SERIES.map(async (s) => {
      try {
        const payload = await fetchJson<SdmxResponse>(
          `https://data-api.ecb.europa.eu/service/data/${s.flow}/${s.key}?lastNObservations=1&format=jsondata`,
          { ttlSeconds: 3600, headers: { Accept: "application/json" } }
        );
        const parsed = payload ? parseLast(payload) : null;
        if (parsed) {
          return { id: s.id, label: s.label, unit: s.unit, value: parsed.value, date: parsed.date };
        }
      } catch {
        // fall through to fallback
      }
      return { id: s.id, label: s.label, unit: s.unit, value: FALLBACK[s.id] ?? 0, date: "" };
    })
  );
  return results;
}
