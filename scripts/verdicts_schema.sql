-- Trainer 3.0 — Verdict-Tabelle (coach/architecture.md, Abschnitt Verdict-Kanal)
-- Auf dem IONOS-Server EINMALIG von Hand ausführen. Nicht automatisch deployt.
-- Ersetzt die vertagte blocks_done-Migration vollständig:
-- "Block erledigt" entfällt zugunsten des Übungs-Verdicts.
--
-- Trägt hit/miss + miss_reason, nie kg. Lastdetails stehen in der Tagesnotiz
-- oder kommen per gezielter WHOOP-Detailabfrage.
--
-- Semantik:
--   verdict     hit | miss                (unknown ist KEIN DB-Wert — es ist die
--                                           Abwesenheit einer Zeile)
--   miss_reason technik | last | NULL     (nur bei class technical gesetzt)
--   source      button | whoop_derived | recap_answer
--   Eindeutigkeit (iso_date, ex_id), last-write-wins (REPLACE / ON DUPLICATE KEY UPDATE).

CREATE TABLE IF NOT EXISTS verdicts (
  iso_date    DATE NOT NULL,
  ex_id       VARCHAR(32) NOT NULL,
  verdict     ENUM('hit','miss') NOT NULL,
  miss_reason ENUM('technik','last') DEFAULT NULL,
  source      ENUM('button','whoop_derived','recap_answer') NOT NULL DEFAULT 'button',
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (iso_date, ex_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
