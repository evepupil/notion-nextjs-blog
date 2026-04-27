import path from 'path';

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) || 'untitled';
}

function getTitle(properties, names) {
  for (const name of names) {
    const property = properties[name];
    const value = property?.title?.[0]?.plain_text;
    if (value) return value;
  }
  return '';
}

function getRichText(properties, names) {
  for (const name of names) {
    const property = properties[name];
    const value = property?.rich_text?.[0]?.plain_text;
    if (value) return value;
  }
  return '';
}

function getSelectName(properties, names) {
  for (const name of names) {
    const property = properties[name];
    const value = property?.select?.name || property?.status?.name;
    if (value) return value;
  }
  return '';
}

function getDateStart(properties, names) {
  for (const name of names) {
    const property = properties[name];
    const value = property?.date?.start;
    if (value) return value;
  }
  return '';
}

function getMultiSelect(properties, names) {
  for (const name of names) {
    const property = properties[name];
    const value = property?.multi_select?.map((tag) => tag.name).filter(Boolean);
    if (value?.length) return value;
  }
  return [];
}

function getFileUrl(properties, names) {
  for (const name of names) {
    const file = properties[name]?.files?.[0];
    const value = file?.file?.url || file?.external?.url;
    if (value) return value;
  }
  return '';
}

export function normalizePostLocale(value) {
  const normalized = String(value || '').trim().replace(/_/g, '-').toLowerCase();
  if (normalized === 'en' || normalized === 'english') {
    return { locale: 'en', lang: 'en' };
  }
  return { locale: 'zh', lang: 'zh-CN' };
}

export function resolveContentDir(cwd, locale) {
  return path.join(cwd, 'content', 'posts', locale);
}

export function resolveAssetsDir(cwd) {
  return path.join(cwd, 'content', 'assets', 'images');
}

export function resolvePostFilePath(cwd, locale, slug) {
  return path.join(resolveContentDir(cwd, locale), `${slug}.md`);
}

export function getImageMarkdownPath(postSlug, filename) {
  return `../../assets/images/${postSlug}/${filename}`;
}

export function getPostMetadata(page) {
  const properties = page.properties || {};
  const title = getTitle(properties, ['Title', '标题', 'Name', '名称']) || 'Untitled';
  const explicitSlug = getRichText(properties, ['Slug', 'slug']);
  const slug = explicitSlug ? generateSlug(explicitSlug) : generateSlug(title);
  const languageValue = getSelectName(properties, ['Language', 'Lang', '语言']) || getRichText(properties, ['Language', 'Lang', '语言']);
  const { locale, lang } = normalizePostLocale(languageValue);
  const translationKey = getRichText(properties, ['Translation Key', 'translationKey', '翻译 Key', '翻译键']) || slug;
  const description = getRichText(properties, ['Description', '描述', 'Summary', '摘要']);
  const coverImage = getFileUrl(properties, ['Featured Image', 'Cover', '封面图', '封面']);
  const publishedDate = getDateStart(properties, ['Published Date', 'Published', '发布日期', '发布时间']) || new Date().toISOString();
  const tags = getMultiSelect(properties, ['Tags', '标签']);
  const category = getSelectName(properties, ['Category', '分类']);

  return {
    title,
    slug,
    locale,
    lang,
    translationKey,
    description,
    coverImage,
    publishedDate,
    tags,
    category,
  };
}
