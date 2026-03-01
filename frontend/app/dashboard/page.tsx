"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { StatCard } from "@/components/stat-card";
import { Users, Building2, Swords, Trophy, TrendingUp, Target } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Jogador, Clube, Partida, Titulo } from "@/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const CHART_COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(199, 89%, 48%)",
  "hsl(43, 96%, 56%)",
  "hsl(280, 65%, 60%)",
  "hsl(12, 76%, 61%)",
  "hsl(160, 60%, 55%)",
  "hsl(199, 70%, 60%)",
];

export default function DashboardPage() {
  const { data: jogadores } = useSWR<Jogador[]>("/jogadores", fetcher);
  const { data: clubes } = useSWR<Clube[]>("/clubes", fetcher);
  const { data: partidas } = useSWR<Partida[]>("/partidas", fetcher);
  const { data: titulos } = useSWR<Titulo[]>("/titulos", fetcher);

  const totalJogadores = jogadores?.length ?? 0;
  const totalClubes = clubes?.length ?? 0;
  const totalPartidas = partidas?.length ?? 0;
  const totalTitulos = titulos?.length ?? 0;

  // Top 5 goleadores
  const topScorers = jogadores
    ?.filter((j) => j.estatisticas_gerais && j.estatisticas_gerais.gols > 0)
    ?.sort((a, b) => (b.estatisticas_gerais?.gols ?? 0) - (a.estatisticas_gerais?.gols ?? 0))
    ?.slice(0, 5)
    ?.map((j) => ({
      nome: j.nome.split(" ").slice(0, 2).join(" "),
      gols: j.estatisticas_gerais?.gols ?? 0,
      assistencias: j.estatisticas_gerais?.assistencias ?? 0,
    })) ?? [];

  // Distribuicao por posicao
  const positionMap: Record<string, number> = {};
  jogadores?.forEach((j) => {
    const pos = j.posicao_principal?.nome ?? "Sem posicao";
    positionMap[pos] = (positionMap[pos] || 0) + 1;
  });
  const positionData = Object.entries(positionMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Ultimas 5 partidas
  const recentMatches = partidas?.slice(0, 5) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visao geral do sistema de selecao de atletas
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Jogadores" value={totalJogadores} icon={Users} description="Atletas cadastrados" />
        <StatCard title="Clubes" value={totalClubes} icon={Building2} description="Clubes registrados" />
        <StatCard title="Partidas" value={totalPartidas} icon={Swords} description="Partidas registradas" />
        <StatCard title="Titulos" value={totalTitulos} icon={Trophy} description="Titulos catalogados" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Scorers Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-card-foreground">Top Goleadores</h2>
          </div>
          {topScorers.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topScorers} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="nome" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
                <Bar dataKey="gols" name="Gols" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assistencias" name="Assist." fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              Sem dados de gols registrados
            </div>
          )}
        </div>

        {/* Position Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-card-foreground">Distribuicao por Posicao</h2>
          </div>
          {positionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {positionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--card-foreground))",
                  }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: "hsl(var(--foreground))", fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              Sem jogadores cadastrados
            </div>
          )}
        </div>
      </div>

      {/* Recent Matches */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-card-foreground">Ultimas Partidas</h2>
          </div>
          <Link
            href="/dashboard/partidas"
            className="text-xs font-medium text-primary hover:underline"
          >
            Ver todas
          </Link>
        </div>
        {recentMatches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Data</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Campeonato</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Casa</th>
                  <th className="pb-3 text-center font-medium text-muted-foreground">Placar</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Fora</th>
                </tr>
              </thead>
              <tbody>
                {recentMatches.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-foreground" suppressHydrationWarning>{formatDate(m.data)}</td>
                    <td className="py-3 text-foreground">{m.campeonato || "-"}</td>
                    <td className="py-3 font-medium text-foreground">{m.clube_casa?.nome ?? "-"}</td>
                    <td className="py-3 text-center">
                      <span className="rounded-md bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">
                        {m.gols_casa ?? 0} x {m.gols_fora ?? 0}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-foreground">{m.clube_fora?.nome ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma partida registrada
          </p>
        )}
      </div>
    </div>
  );
}
