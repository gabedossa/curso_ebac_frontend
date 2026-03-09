const versions = [
  {
    createdAt: '2026-04-16',
    finishedAt: '2026-04-18',
    author: 'John Doe',
    role: 'Anal. de Softw.',
    version: '0.0.1',
    description: 'Criação do projeto',
  },
  {
    createdAt: '2026-06-07',
    finishedAt: '2026-06-25',
    author: 'John Doe',
    role: 'Anal. de Softw.',
    version: '0.1.0',
    description: 'Ajustes API',
  },
  {
    createdAt: '2026-07-28',
    finishedAt: '2026-08-05',
    author: 'John Doe',
    role: 'Anal. de Softw.',
    version: '1.0.0',
    description: 'Lançamento da aplicação',
  },
];

const tableBody = document.querySelector('#versionTableBody');
const searchInput = document.querySelector('#searchInput');
const sortSelect = document.querySelector('#sortSelect');
const emptyState = document.querySelector('#emptyState');
const resultsCount = document.querySelector('#resultsCount');

const totalVersions = document.querySelector('#totalVersions');
const timelineRange = document.querySelector('#timelineRange');
const lastRelease = document.querySelector('#lastRelease');
const latestVersion = document.querySelector('#latestVersion');
const latestDescription = document.querySelector('#latestDescription');

const formatDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

const parseVersion = (value) =>
  value
    .split('.')
    .map((part) => Number(part))
    .reduce((accumulator, current, index) => accumulator + current / 10 ** (index * 3), 0);

const compareDates = (key, direction) => (a, b) => {
  const first = new Date(a[key]);
  const second = new Date(b[key]);
  return direction === 'asc' ? first - second : second - first;
};

const compareVersion = (direction) => (a, b) => {
  const first = parseVersion(a.version);
  const second = parseVersion(b.version);
  return direction === 'asc' ? first - second : second - first;
};

const getLatestRelease = () =>
  [...versions].sort((a, b) => new Date(b.finishedAt) - new Date(a.finishedAt))[0];

const getFilteredAndSortedData = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const [field, direction] = sortSelect.value.split('-');

  const filtered = [...versions].filter((item) => {
    const rowContent = [
      item.author,
      item.role,
      item.version,
      item.description,
      formatDate(item.createdAt),
      formatDate(item.finishedAt),
    ]
      .join(' ')
      .toLowerCase();

    return rowContent.includes(searchTerm);
  });

  if (field === 'version') {
    return filtered.sort(compareVersion(direction));
  }

  const sortKey = field === 'created' ? 'createdAt' : 'finishedAt';
  return filtered.sort(compareDates(sortKey, direction));
};

const renderSummary = () => {
  const firstCreation = [...versions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
  const latest = getLatestRelease();

  totalVersions.textContent = String(versions.length);
  timelineRange.textContent = `${formatDate(firstCreation.createdAt)} → ${formatDate(latest.finishedAt)}`;
  lastRelease.textContent = `${latest.version} · ${formatDate(latest.finishedAt)}`;
  latestVersion.textContent = latest.version;
  latestDescription.textContent = latest.description;
};

const renderTable = () => {
  const data = getFilteredAndSortedData();

  tableBody.innerHTML = data
    .map(
      (item) => `
        <tr>
          <td>${formatDate(item.createdAt)}</td>
          <td>${formatDate(item.finishedAt)}</td>
          <td>${item.author}</td>
          <td>${item.role}</td>
          <td><span class="version-badge">${item.version}</span></td>
          <td>${item.description}</td>
        </tr>
      `,
    )
    .join('');

  resultsCount.textContent = `${data.length} ${data.length === 1 ? 'resultado' : 'resultados'}`;
  emptyState.hidden = data.length > 0;
};

searchInput.addEventListener('input', renderTable);
sortSelect.addEventListener('change', renderTable);

document.addEventListener('DOMContentLoaded', () => {
  renderSummary();
  renderTable();
});
