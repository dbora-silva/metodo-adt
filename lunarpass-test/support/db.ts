// this is the Database interface we defined earlier
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Mission, Reservation, Ticket } from './types'
import { CamelCasePlugin } from 'kysely'

try {
  process.loadEnvFile();
} catch {
  // .env is optional locally when DATABASE_URL is already exported in the shell (e.g. CI).
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Copie .env.example para .env e informe a connection string do Supabase.');
}

interface Database {
  missions: Mission
  reservations: Reservation
  tickets: Ticket
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
})

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()]
})

const PT_MONTHS: Record<string, string> = {
  jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
  jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12',
};

function toIsoDate(ptDate: string): string {
  const match = ptDate.match(/(\d{1,2}) de (\w+)\.? de (\d{4})/i);
  if (!match) throw new Error(`Data inválida: ${ptDate}`);
  const [, day, month, year] = match;
  return `${year}-${PT_MONTHS[month.toLowerCase()]}-${day.padStart(2, '0')}`;
}

export async function insertMission(mission: Mission) {
  await db
  .insertInto('missions')
  .values({
    ...mission,
    returnDate: toIsoDate(mission.returnDate),
  })
  .execute()
}

export async function deleteMission(id: string) {
  await db
    .deleteFrom('missions')
    .where('id', '=', id)
    .execute()
}

export async function deleteReservetion(missionid: string) {
  await db
    .deleteFrom('reservations')
    .where('missionId', '=', missionid)
    .execute()
}

export async function deleteTicket(missionid: string) {
  await db
    .deleteFrom('tickets')
    .where('missionId', '=', missionid)
    .execute()
}