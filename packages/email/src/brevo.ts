export type Brevo = {
  sendEmail: (options: {
    to: {
      email: string;
      name?: string;
    }[];
    subject: string;
    htmlContent: string;
    sender: {
      name: string;
      email: string;
    };
    attachment?: {
      name: string;
      content: string; // Base64 encoded content
    }[];
    params?: Record<string, string>;
    scheduledAt?: string; // ISO 8601 format
  }) => Promise<void>;
};

const fetcher = async (
  endpoint: string,
  apiKey: string,
  options?: RequestInit
) => {
  const res = await fetch(`https://api.brevo.com/v3/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `Brevo API error: ${res.status} ${res.statusText} - ${errorBody}`
    );
  }

  return await res.json();
};

type BrevoOptions = {
  sandbox?: boolean; // If true, use Brevo's sandbox environment (if available)
};

export const createBrevo = (apiKey: string, opts: BrevoOptions): Brevo => {
  const { sandbox = false } = opts;

  return {
    sendEmail: async ({
      to,
      subject,
      htmlContent,
      sender,
      scheduledAt,
      params,
      attachment,
    }) => {
      await fetcher("smtp/email", apiKey, {
        method: "POST",
        body: JSON.stringify({
          sender,
          to,
          subject,
          htmlContent,
          scheduledAt,
          params,
          attachment,
        }),
        headers: sandbox
          ? {
              "X-Sib-Sandbox": "drop",
            }
          : undefined,
      });
    },
  };
};
