import ghRelease from 'gh-release'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import {
  listCommits,
  lastTag,
  getPreviousTag,
  getCurrentBranch,
  getGithubToken,
  getSortableAllTags,
  getTaggedTime,
} from './git'

const LernaJSON = fs.readJSONSync(path.resolve(__dirname, '../../lerna.json'))

const ReleaseTitle = 'Designable Release 🚀'

const GithubRepo = 'https://github.com/anthubdev/designable'

const CommitGroupBy: Array<[string, string[]]> = [
  [':tada: Enhancements', ['feat', 'features', 'feature']],
  [':beetle: Bug Fixes', ['bug', 'bugfix', 'fix']],
  [':boom: Breaking Changes', ['breaking', 'break']],
  [':memo: Documents Changes', ['doc', 'docs']],
  [':rose: Improve code quality', ['refactor', 'redesign']],
  [':rocket: Improve Performance', ['perf']],
  [':hammer_and_wrench: Update Workflow Scripts', ['build']],
  [':construction: Add/Update Test Cases', ['test']],
  [':blush: Other Changes', ['chore']],
]

const compareTwoStrings = (first, second) => {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (first === second) return 1; // identical or empty
	if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

	const firstBigrams = new Map();
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram) + 1
			: 1;

		firstBigrams.set(bigram, count);
	};

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram)
			: 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

const isPublishMessage = (str: string) => {
  if (/chore\(\s*(?:versions?|publish)\s*\)/.test(str)) return true
  return /publish v?(?:\d+)\.(?:\d+)\.(?:\d+)/.test(str)
}

const getCurrentChanges = (from = lastTag(), to = 'HEAD') => {
  const summarys: string[] = []
  return listCommits(from, to).filter(({ summary }) => {
    if (summarys.some((target) => compareTwoStrings(target, summary) > 0.5))
      return false
    if (isPublishMessage(summary)) return false
    summarys.push(summary)
    return true
  })
}

const getGroupChanges = (from = lastTag(), to = 'HEAD') => {
  const changes = getCurrentChanges(from, to)
  const results: Array<[string, string[]]> = CommitGroupBy.map(([group]) => [
    group,
    [],
  ])
  changes.forEach(({ summary, author, sha }) => {
    for (const [group, value] of CommitGroupBy) {
      if (value.some((target) => new RegExp(target).test(summary))) {
        results.forEach((item) => {
          if (item[0] === group) {
            item[1].push(
              `[${summary}](${GithubRepo}/commit/${sha}) :point_right: ( [${author}](https://github.com/${author}) )`
            )
          }
        })
      }
    }
  })
  return results.filter(([, value]) => {
    return value.length > 0
  })
}

const createChangelog = (from = lastTag(), to = 'HEAD') => {
  const isHead = to === 'HEAD'
  const headVersion = isHead ? LernaJSON?.version : to
  const changes = getGroupChanges(from, to)
  const nowDate = isHead
    ? dayjs().format('YYYY-MM-DD')
    : dayjs(getTaggedTime(to), 'YYYY-MM-DD').format('YYYY-MM-DD')
  const log = changes
    .map(([group, contents]) => {
      return `
### ${group}
${contents
  .map((content) => {
    return `
1. ${content}    
`
  })
  .join('')}  
`
    })
    .join('')
  return `
## ${headVersion}(${nowDate})

${log ? log : '### No Change Log'}
`
}

const isPrerelease = (tag: string) => {
  return /(?:beta|rc|alpha)/.test(tag)
}

const createReleaseNote = () => {
  const to = lastTag()
  const from = getPreviousTag(to)
  const body = createChangelog(from, to)
  const branch = getCurrentBranch()
  const token = getGithubToken()
  return new Promise((resolve, reject) => {
    ghRelease(
      {
        cli: true,
        tag_name: to,
        target_commitish: branch,
        name: `${ReleaseTitle} - ${to}`,
        body,
        draft: false,
        prerelease: isPrerelease(to),
        owner: 'alibaba',
        repo: 'designable',
        endpoint: 'https://api.github.com',
        auth: {
          token,
        },
      },
      (err: unknown, response: unknown) => {
        if (err) {
          reject()
        } else {
          resolve(response)
        }
      }
    )
  })
}

const generateChangeLogFile = () => {
  const tags = getSortableAllTags()
  const file = `
# Changelog
${tags
  .slice(0, 40)
  .map((newer, index) => {
    const older = tags[index + 1]
    if (older) {
      return createChangelog(older, newer)
    }
    return ''
  })
  .join('')}  
`
  fs.writeFileSync(path.resolve(__dirname, '../../CHANGELOG.md'), file, 'utf8')
}

if (process.argv.includes('release')) {
  createReleaseNote()
  console.log('🎉：Release Note upload success!')
} else if (process.argv.includes('changelog')) {
  generateChangeLogFile()
  console.log('🎉：Changelog generate success!')
}
