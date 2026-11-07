import React, { useState } from 'react';
import { MARKET_DATA } from '../../constants/data';
import { Icon } from '../Icons';

export function DashboardView() {
  const [selectedCompareGenres, setSelectedCompareGenres] = useState([]);
  const [compareNotice, setCompareNotice] = useState('');

  const handleToggleCompare = (genreName) => {
    setCompareNotice('');
    if (selectedCompareGenres.includes(genreName)) {
      setSelectedCompareGenres(prev => prev.filter(g => g !== genreName));
      return;
    }
    if (selectedCompareGenres.length >= 3) {
      setCompareNotice('Maksimal tiga genre dapat dibandingkan sekaligus.');
      return;
    }
    setSelectedCompareGenres(prev => [...prev, genreName]);
  };

  const getCompareStatusText = () => {
    if (compareNotice) return compareNotice;
    if (selectedCompareGenres.length === 0) {
      return 'Pilih genre untuk membandingkan jumlah pemilik.';
    }
    const summary = selectedCompareGenres.map(name => {
      const g = MARKET_DATA.genres.find(item => item.name === name);
      return `${name} ${g?.count || ''}`;
    });
    return `${selectedCompareGenres.length} genre dipilih: ${summary.join(' · ')}`;
  };

  return (
    <section className="dashboard-view" id="dashboard-view" aria-labelledby="dashboard-title">
      <div className="dashboard-heading">
        <div>
          <span className="step-kicker">
            ANALISIS PASAR <span className="demo-pill">DATA DEMO</span>
          </span>
          <h2 id="dashboard-title">Genre populer di Steam</h2>
          <p>Lihat gambaran minat pemain sebagai bahan pertimbangan ide game-mu.</p>
        </div>
        <button className="period-select" type="button" aria-label="Periode data">
          Dataset 2024{' '}
          <span>
            <Icon name="chevron-down" />
          </span>
        </button>
      </div>

      <div className="market-kpis">
        <article className="market-kpi">
          <span className="kpi-label">TOTAL ESTIMASI PEMILIK</span>
          <strong>{MARKET_DATA.totalOwners}</strong>
          <span className="kpi-foot">di seluruh genre demo</span>
          <span className="kpi-symbol">
            <Icon name="users" />
          </span>
        </article>

        <article className="market-kpi">
          <span className="kpi-label">RATA-RATA PER GENRE</span>
          <strong>{MARKET_DATA.avgOwners}</strong>
          <span className="kpi-foot">estimasi pemilik</span>
          <span className="kpi-symbol">
            <Icon name="chart" />
          </span>
        </article>

        <article className="market-kpi accent-kpi">
          <span className="kpi-label">GENRE TERATAS</span>
          <strong>{MARKET_DATA.topGenre}</strong>
          <span className="kpi-foot">{MARKET_DATA.topGenreOwners} estimasi pemilik</span>
          <span className="kpi-symbol">
            <Icon name="sparkle" />
          </span>
        </article>
      </div>

      <div className="dashboard-grid">
        <section className="market-panel chart-panel" aria-labelledby="owners-chart-title">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">PEMINAT PER GENRE</span>
              <h3 id="owners-chart-title">Estimasi jumlah pemilik</h3>
            </div>
            <span className="chart-legend">
              <i></i> Pemilik
            </span>
          </div>

          <div
            className="genre-chart"
            role="img"
            aria-label="Grafik data demo estimasi pemilik genre Steam."
          >
            <div className="chart-gridlines">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>

            {MARKET_DATA.genres.map((g) => {
              const isSelected = selectedCompareGenres.includes(g.name);
              const isMuted = selectedCompareGenres.length > 0 && !isSelected;

              let rowClass = 'chart-row';
              if (isSelected) rowClass += ' comparison-highlight';
              if (isMuted) rowClass += ' comparison-muted';

              return (
                <div key={g.name} className={rowClass} data-genre={g.name}>
                  <span>{g.name}</span>
                  <div className="bar-track">
                    <i style={{ '--bar': g.percent }}></i>
                  </div>
                  <b>{g.count}</b>
                </div>
              );
            })}
          </div>

          <div className="chart-axis">
            <span>0</span>
            <span>50 jt</span>
            <span>100 jt</span>
            <span>150 jt</span>
            <span>200 jt</span>
          </div>
        </section>

        <aside className="market-panel ranking-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">PERINGKAT</span>
              <h3>Genre paling ramai</h3>
            </div>
            <span className="ranking-badge">TOP 5</span>
          </div>

          <ol className="genre-ranking">
            {MARKET_DATA.top5.map((item) => (
              <li key={item.rank}>
                <span className={`rank-number ${item.isFirst ? 'rank-first' : ''}`}>
                  {item.rank}
                </span>
                <span className="rank-copy">
                  <strong>{item.name}</strong>
                  <small>{item.owners}</small>
                </span>
                <span className="rank-share">{item.share}</span>
              </li>
            ))}
          </ol>

          <div className="ranking-insight">
            <span>
              <Icon name="bulb" />
            </span>
            <p>Action punya estimasi pemilik paling tinggi pada data demo ini.</p>
          </div>
        </aside>
      </div>

      <section className="market-panel compare-panel" aria-labelledby="compare-title">
        <div className="panel-heading">
          <div>
            <span className="panel-eyebrow">BANDINGKAN</span>
            <h3 id="compare-title">Pilih genre untuk dibandingkan</h3>
          </div>
          <span className="compare-limit">MAKS. 3</span>
        </div>

        <div
          className="genre-compare-options"
          id="genre-compare-options"
          aria-label="Pilih genre untuk dibandingkan"
        >
          {MARKET_DATA.genres.map((g) => {
            const isSelected = selectedCompareGenres.includes(g.name);
            return (
              <button
                key={g.name}
                type="button"
                data-genre={g.name}
                className={isSelected ? 'selected' : ''}
                aria-pressed={isSelected}
                onClick={() => handleToggleCompare(g.name)}
              >
                {g.name}
              </button>
            );
          })}
        </div>

        <p className="compare-status" id="compare-status" role="status" aria-live="polite">
          {getCompareStatusText()}
        </p>
      </section>

      <p className="dashboard-disclaimer">
        Angka pada dashboard ini adalah data demo untuk pratinjau antarmuka, bukan statistik Steam aktual.
      </p>
    </section>
  );
}
