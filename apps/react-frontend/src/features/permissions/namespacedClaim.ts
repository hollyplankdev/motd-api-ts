/**
 * Constructs the string for a namespaced claim for this app. This namespaced claim string follows
 * the Auth0 guidelines:
 * https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims#namespaced-guidelines
 *
 * @param claim The name of the claim to be wrapped in a namespace.
 * @returns The fully namespaced claim, specific to this app.
 */
export default function namespacedClaim(claim: string) {
  return `https://motd.hollyplank.com/${claim}`;
}
