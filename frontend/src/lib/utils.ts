import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXml(xml: string): string {
  let formatted = "";
  let indent = "";
  const tab = "  ";

  xml.split(/>\s*</).forEach((node) => {
    if (node.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }
    formatted += indent + "<" + node + ">\n";
    if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith("?")) {
      indent += tab;
    }
  });

  return formatted.substring(1, formatted.length - 2);
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + "...";
}

export function getNetworkColor(network: string): string {
  switch (network.toLowerCase()) {
    case "fednow":
      return "badge-cyan";
    case "sepa":
      return "badge-indigo";
    case "swift":
      return "badge-warning";
    default:
      return "badge-cyan";
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "settled":
    case "accepted":
    case "passed":
      return "badge-success";
    case "rejected":
    case "failed":
      return "badge-error";
    case "pending":
    case "warning":
      return "badge-warning";
    case "returned":
      return "badge-indigo";
    default:
      return "badge-cyan";
  }
}

export function getStatusDotClass(status: string): string {
  switch (status.toLowerCase()) {
    case "settled":
    case "accepted":
    case "active":
    case "completed":
      return "active";
    case "pending":
      return "pending";
    case "rejected":
    case "failed":
    case "error":
      return "error";
    default:
      return "active";
  }
}

export function highlightXml(xml: string): string {
  return xml
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /(&lt;\/?)([\w:]+)/g,
      '$1<span class="xml-tag">$2</span>'
    )
    .replace(
      /(\w+)(=)/g,
      '<span class="xml-attr">$1</span>$2'
    )
    .replace(
      /(".*?")/g,
      '<span class="xml-value">$1</span>'
    )
    .replace(
      /(&lt;!--.*?--&gt;)/g,
      '<span class="xml-comment">$1</span>'
    );
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
