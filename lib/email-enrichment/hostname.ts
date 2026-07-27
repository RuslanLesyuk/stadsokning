import dns from "node:dns/promises"
import net from "node:net"

export function normalizeWebsite(value: string) {
  const website = value.trim()

  if (!website) {
    return null
  }

  try {
    const preparedWebsite =
      website.startsWith("http://") ||
      website.startsWith("https://")
        ? website
        : `https://${website}`

    const url = new URL(preparedWebsite)

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return null
    }

    url.hash = ""

    return url
  } catch {
    return null
  }
}

function isPrivateIpv4(address: string) {
  const parts = address
    .split(".")
    .map((part) => Number(part))

  if (
    parts.length !== 4 ||
    parts.some(
      (part) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255,
    )
  ) {
    return true
  }

  const [first, second] = parts

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 &&
      second >= 16 &&
      second <= 31) ||
    (first === 192 && second === 168) ||
    first >= 224
  )
}

function isPrivateIpv6(address: string) {
  const normalized = address.toLowerCase()

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb") ||
    normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") ||
    normalized.startsWith("::ffff:192.168.")
  )
}

function isPrivateIp(address: string) {
  const version = net.isIP(address)

  if (version === 4) {
    return isPrivateIpv4(address)
  }

  if (version === 6) {
    return isPrivateIpv6(address)
  }

  return true
}

export async function assertPublicHostname(
  hostname: string,
) {
  const normalizedHostname = hostname
    .trim()
    .toLowerCase()
    .replace(/\.$/, "")

  if (
    !normalizedHostname ||
    normalizedHostname === "localhost" ||
    normalizedHostname.endsWith(".localhost") ||
    normalizedHostname.endsWith(".local") ||
    normalizedHostname.endsWith(".internal")
  ) {
    throw new Error("Blocked website hostname.")
  }

  if (net.isIP(normalizedHostname)) {
    if (isPrivateIp(normalizedHostname)) {
      throw new Error("Blocked private IP address.")
    }

    return
  }

  let addresses: Array<{
    address: string
    family: number
  }>

  try {
    addresses = await dns.lookup(normalizedHostname, {
      all: true,
      verbatim: true,
    })
  } catch {
    throw new Error(
      "Website hostname could not be resolved.",
    )
  }

  if (!addresses.length) {
    throw new Error(
      "Website hostname has no IP address.",
    )
  }

  for (const address of addresses) {
    if (isPrivateIp(address.address)) {
      throw new Error(
        "Website resolves to a blocked private IP address.",
      )
    }
  }
}