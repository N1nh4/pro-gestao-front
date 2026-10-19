/* Client do Diagnóstico Pró-Gestão — requisitos do manual. */

import { apiFetch } from "./client";
import { type DimensaoId, type Requisito } from "@/lib/domain/progestao";

interface RequisitoDto {
  cod: string;
  dimensao: string;
  titulo: string;
  essencial: boolean;
  nivel_minimo: string | null;
  descricao_nivel_i?: string | null;
  descricao_nivel_ii?: string | null;
  descricao_nivel_iii?: string | null;
  descricao_nivel_iv?: string | null;
}

const DIMS: DimensaoId[] = ["CI", "GC", "EP"];

export function toRequisito(dto: RequisitoDto): Requisito {
  const dim = (DIMS.includes(dto.dimensao as DimensaoId) ? dto.dimensao : "CI") as DimensaoId;
  return {
    cod: dto.cod,
    dim,
    desc: dto.titulo,
    resp: "",
    st: "nao",
    evid: 0,
    aud: "",
    ess: dto.essencial,
  };
}

export async function listarRequisitos(): Promise<Requisito[]> {
  const dtos = await apiFetch<RequisitoDto[]>("/api/requisitos");
  return dtos.map(toRequisito);
}
