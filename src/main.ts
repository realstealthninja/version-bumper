import * as core from "@actions/core";
import * as github from "@actions/github";
import { PushEvent } from "@octokit/webhooks-types";
import { SemVer } from "semver";

async function run() {
  // Inputs
  const secret: string = core.getInput("githubSecret");
  const octokit = github.getOctokit(secret);

  if (github.context.eventName !== "push") {
    throw "invalid context";
  }

  const pushPayload = github.context.payload as PushEvent;

  let version: SemVer = new SemVer("0.0.0");

  for (const commit of pushPayload.commits) {
    if (commit.message.startsWith("fix")) {
      version.patch += 1;
    } else if (commit.message.startsWith("feat")) {
      version.minor += 1;
    }

    if (commit.message.includes("BREAKING CHANGE:")) {
      version.major += 1;
    }
  }
}

export default run;
