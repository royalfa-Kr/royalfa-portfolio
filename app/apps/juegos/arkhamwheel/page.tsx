"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

// Art Deco display font token (Cinzel is loaded cleanly on client mount; works in both Next.js & Preview)
const cinzel = {
  className: "font-['Cinzel',Georgia,serif]",
};

/*****************************************************************************
 * 1. TYPES & INTERFACES
 *****************************************************************************/
type InvestigatorClass = "Guardian" | "Seeker" | "Rogue" | "Mystic" | "Survivor" | "Neutral";
type InvestigatorEra = "Chapter 1" | "Parallel" | "Chapter 2" | "Bonus";
type TabKey = "investigators" | "campaigns" | "limited";
type LimitedMode = "individual" | "shared";
type ToastType = "success" | "warn" | "info";

interface Investigator {
  id: string;
  character: string;
  name: string;
  subtitle: string;
  cls: InvestigatorClass;
  era: InvestigatorEra;
  expansion: string;
}

interface RoleDef {
  key: "Cluever" | "Fighter" | "Flex" | "Support";
  label: string;
  desc: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

interface DraftedInvestigator extends Investigator {
  assignedRole: RoleDef | null;
}

interface OfficialCampaign {
  id: string;
  baseName: string;
  hasReturn: boolean;
  note: string;
  color: string;
}

interface CustomCampaign {
  id: string;
  name: string;
  note: string;
}

interface CampaignEntry {
  id: string;
  name: string;
  shortName: string;
  note: string;
  color: string;
  tag: string;
  isCustom: boolean;
}

interface LimitedExpansion {
  id: string;
  name: string;
  hasReturn: boolean;
  color: string;
}

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface RestoreSnapshot {
  savedAt?: string;
  partySize?: number;
  smartRoleBalance?: boolean;
  enabledEras?: InvestigatorEra[];
  enabledClasses?: InvestigatorClass[];
  includeSuzi?: boolean;
  customInvestigators?: Investigator[];
  manuallyExcludedIds?: string[];
  drawnParty?: DraftedInvestigator[];
  campSplitReturn?: boolean;
  campNoRepeat?: boolean;
  customCampaigns?: CustomCampaign[];
  drawnCampaigns?: CampaignEntry[];
  selectedCampaign?: CampaignEntry | null;
  limMode?: LimitedMode;
  limOwnedIds?: string[];
  limSharedPool?: LimitedExpansion[];
  limPlayerPools?: LimitedExpansion[][];
}

/*****************************************************************************
 * 2. OFFICIAL DATABASES (88 INVESTIGATORS + SUZI, CAMPAIGNS, EXPANSIONS)
 *****************************************************************************/
const CLASS_ORDER: InvestigatorClass[] = [
  "Guardian",
  "Seeker",
  "Rogue",
  "Mystic",
  "Survivor",
  "Neutral",
];

const CLASS_META: Record<
  InvestigatorClass,
  {
    color: string;
    altColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  }
> = {
  Guardian: {
    color: "#1b6ca8",
    altColor: "#165a8d",
    badgeBg: "rgba(27, 108, 168, 0.25)",
    badgeBorder: "rgba(59, 158, 255, 0.55)",
    badgeText: "#8ecaff",
  },
  Seeker: {
    color: "#c97a16",
    altColor: "#ad6711",
    badgeBg: "rgba(201, 122, 22, 0.25)",
    badgeBorder: "rgba(245, 166, 35, 0.55)",
    badgeText: "#ffd285",
  },
  Rogue: {
    color: "#1e7a48",
    altColor: "#18643a",
    badgeBg: "rgba(30, 122, 72, 0.25)",
    badgeBorder: "rgba(46, 204, 113, 0.55)",
    badgeText: "#84f0b1",
  },
  Mystic: {
    color: "#6b3282",
    altColor: "#58286b",
    badgeBg: "rgba(107, 50, 130, 0.28)",
    badgeBorder: "rgba(175, 115, 210, 0.55)",
    badgeText: "#dfb5f7",
  },
  Survivor: {
    color: "#9e2a2b",
    altColor: "#842122",
    badgeBg: "rgba(158, 42, 43, 0.28)",
    badgeBorder: "rgba(231, 76, 60, 0.55)",
    badgeText: "#ffaba3",
  },
  Neutral: {
    color: "#545d66",
    altColor: "#454d55",
    badgeBg: "rgba(84, 93, 102, 0.3)",
    badgeBorder: "rgba(160, 174, 192, 0.55)",
    badgeText: "#d6dde6",
  },
};

const ERA_ORDER: ("Chapter 1" | "Parallel" | "Chapter 2")[] = [
  "Chapter 1",
  "Parallel",
  "Chapter 2",
];

const ERA_META: Record<"Chapter 1" | "Parallel" | "Chapter 2", { label: string; desc: string }> = {
  "Chapter 1": { label: "Chapter 1", desc: "Core Set – The Drowned City" },
  Parallel: { label: "Parallel", desc: "Official Print & Play / Promo" },
  "Chapter 2": { label: "Chapter 2", desc: "2026 Core Set & Evergreen Decks" },
};

const INVESTIGATORS: Investigator[] = [
  // === CHAPTER 1: CORE SET ===
  { id: "c1-roland", character: "Roland Banks", name: "Roland Banks", subtitle: "The Fed", cls: "Guardian", era: "Chapter 1", expansion: "Core Set (Chapter 1)" },
  { id: "c1-daisy", character: "Daisy Walker", name: "Daisy Walker", subtitle: "The Librarian", cls: "Seeker", era: "Chapter 1", expansion: "Core Set (Chapter 1)" },
  { id: "c1-skids", character: '"Skids" O\'Toole', name: '"Skids" O\'Toole', subtitle: "The Ex-Con", cls: "Rogue", era: "Chapter 1", expansion: "Core Set (Chapter 1)" },
  { id: "c1-agnes", character: "Agnes Baker", name: "Agnes Baker", subtitle: "The Waitress", cls: "Mystic", era: "Chapter 1", expansion: "Core Set (Chapter 1)" },
  { id: "c1-wendy", character: "Wendy Adams", name: "Wendy Adams", subtitle: "The Urchin", cls: "Survivor", era: "Chapter 1", expansion: "Core Set (Chapter 1)" },
  // === CHAPTER 1: THE DUNWICH LEGACY ===
  { id: "c1-zoey", character: "Zoey Samaras", name: "Zoey Samaras", subtitle: "The Chef", cls: "Guardian", era: "Chapter 1", expansion: "The Dunwich Legacy" },
  { id: "c1-rex", character: "Rex Murphy", name: "Rex Murphy", subtitle: "The Reporter", cls: "Seeker", era: "Chapter 1", expansion: "The Dunwich Legacy" },
  { id: "c1-jenny", character: "Jenny Barnes", name: "Jenny Barnes", subtitle: "The Dilettante", cls: "Rogue", era: "Chapter 1", expansion: "The Dunwich Legacy" },
  { id: "c1-jim", character: "Jim Culver", name: "Jim Culver", subtitle: "The Musician", cls: "Mystic", era: "Chapter 1", expansion: "The Dunwich Legacy" },
  { id: "c1-pete", character: '"Ashcan" Pete', name: '"Ashcan" Pete', subtitle: "The Drifter", cls: "Survivor", era: "Chapter 1", expansion: "The Dunwich Legacy" },
  // === CHAPTER 1: THE PATH TO CARCOSA ===
  { id: "c1-mark", character: "Mark Harrigan", name: "Mark Harrigan", subtitle: "The Soldier", cls: "Guardian", era: "Chapter 1", expansion: "The Path to Carcosa" },
  { id: "c1-minh", character: "Minh Thi Phan", name: "Minh Thi Phan", subtitle: "The Secretary", cls: "Seeker", era: "Chapter 1", expansion: "The Path to Carcosa" },
  { id: "c1-sefina", character: "Sefina Rousseau", name: "Sefina Rousseau", subtitle: "The Painter", cls: "Rogue", era: "Chapter 1", expansion: "The Path to Carcosa" },
  { id: "c1-akachi", character: "Akachi Onyele", name: "Akachi Onyele", subtitle: "The Shaman", cls: "Mystic", era: "Chapter 1", expansion: "The Path to Carcosa" },
  { id: "c1-yorick", character: "William Yorick", name: "William Yorick", subtitle: "The Gravedigger", cls: "Survivor", era: "Chapter 1", expansion: "The Path to Carcosa" },
  { id: "c1-lola", character: "Lola Hayes", name: "Lola Hayes", subtitle: "The Actress", cls: "Neutral", era: "Chapter 1", expansion: "The Path to Carcosa" },
  // === CHAPTER 1: THE FORGOTTEN AGE ===
  { id: "c1-leo", character: "Leo Anderson", name: "Leo Anderson", subtitle: "The Expedition Leader", cls: "Guardian", era: "Chapter 1", expansion: "The Forgotten Age" },
  { id: "c1-ursula", character: "Ursula Downs", name: "Ursula Downs", subtitle: "The Explorer", cls: "Seeker", era: "Chapter 1", expansion: "The Forgotten Age" },
  { id: "c1-finn", character: "Finn Edwards", name: "Finn Edwards", subtitle: "The Bootlegger", cls: "Rogue", era: "Chapter 1", expansion: "The Forgotten Age" },
  { id: "c1-mateo", character: "Father Mateo", name: "Father Mateo", subtitle: "The Priest", cls: "Mystic", era: "Chapter 1", expansion: "The Forgotten Age" },
  { id: "c1-calvin", character: "Calvin Wright", name: "Calvin Wright", subtitle: "The Haunted", cls: "Survivor", era: "Chapter 1", expansion: "The Forgotten Age" },
  // === CHAPTER 1: THE CIRCLE UNDONE ===
  { id: "c1-carolyn", character: "Carolyn Fern", name: "Carolyn Fern", subtitle: "The Psychologist", cls: "Guardian", era: "Chapter 1", expansion: "The Circle Undone" },
  { id: "c1-joe", character: "Joe Diamond", name: "Joe Diamond", subtitle: "The Private Investigator", cls: "Seeker", era: "Chapter 1", expansion: "The Circle Undone" },
  { id: "c1-preston", character: "Preston Fairmont", name: "Preston Fairmont", subtitle: "The Millionaire", cls: "Rogue", era: "Chapter 1", expansion: "The Circle Undone" },
  { id: "c1-diana", character: "Diana Stanley", name: "Diana Stanley", subtitle: "The Redeemed Cultist", cls: "Mystic", era: "Chapter 1", expansion: "The Circle Undone" },
  { id: "c1-marie", character: "Marie Lambeau", name: "Marie Lambeau", subtitle: "The Entertainer", cls: "Mystic", era: "Chapter 1", expansion: "The Circle Undone" },
  { id: "c1-rita", character: "Rita Young", name: "Rita Young", subtitle: "The Athlete", cls: "Survivor", era: "Chapter 1", expansion: "The Circle Undone" },
  // === CHAPTER 1: THE DREAM-EATERS ===
  { id: "c1-tommy", character: "Tommy Muldoon", name: "Tommy Muldoon", subtitle: "The Rookie Cop", cls: "Guardian", era: "Chapter 1", expansion: "The Dream-Eaters" },
  { id: "c1-mandy", character: "Mandy Thompson", name: "Mandy Thompson", subtitle: "The Researcher", cls: "Seeker", era: "Chapter 1", expansion: "The Dream-Eaters" },
  { id: "c1-tony", character: "Tony Morgan", name: "Tony Morgan", subtitle: "The Bounty Hunter", cls: "Rogue", era: "Chapter 1", expansion: "The Dream-Eaters" },
  { id: "c1-luke", character: "Luke Robinson", name: "Luke Robinson", subtitle: "The Dreamer", cls: "Mystic", era: "Chapter 1", expansion: "The Dream-Eaters" },
  { id: "c1-patrice", character: "Patrice Hathaway", name: "Patrice Hathaway", subtitle: "The Violinist", cls: "Survivor", era: "Chapter 1", expansion: "The Dream-Eaters" },
  // === CHAPTER 1: INVESTIGATOR STARTER DECKS ===
  { id: "c1-nathaniel", character: "Nathaniel Cho", name: "Nathaniel Cho", subtitle: "The Boxer", cls: "Guardian", era: "Chapter 1", expansion: "Investigator Starter Decks" },
  { id: "c1-harvey", character: "Harvey Walters", name: "Harvey Walters", subtitle: "The Professor", cls: "Seeker", era: "Chapter 1", expansion: "Investigator Starter Decks" },
  { id: "c1-winifred", character: "Winifred Habbamock", name: "Winifred Habbamock", subtitle: "The Aviatrix", cls: "Rogue", era: "Chapter 1", expansion: "Investigator Starter Decks" },
  { id: "c1-jacqueline", character: "Jacqueline Fine", name: "Jacqueline Fine", subtitle: "The Psychic", cls: "Mystic", era: "Chapter 1", expansion: "Investigator Starter Decks" },
  { id: "c1-stella", character: "Stella Clark", name: "Stella Clark", subtitle: "The Letter Carrier", cls: "Survivor", era: "Chapter 1", expansion: "Investigator Starter Decks" },
  // === CHAPTER 1: THE INNSMOUTH CONSPIRACY ===
  { id: "c1-mary", character: "Sister Mary", name: "Sister Mary", subtitle: "The Nun", cls: "Guardian", era: "Chapter 1", expansion: "The Innsmouth Conspiracy" },
  { id: "c1-amanda", character: "Amanda Sharpe", name: "Amanda Sharpe", subtitle: "The Student", cls: "Seeker", era: "Chapter 1", expansion: "The Innsmouth Conspiracy" },
  { id: "c1-trish", character: "Trish Scarborough", name: "Trish Scarborough", subtitle: "The Spy", cls: "Rogue", era: "Chapter 1", expansion: "The Innsmouth Conspiracy" },
  { id: "c1-dexter", character: "Dexter Drake", name: "Dexter Drake", subtitle: "The Magician", cls: "Mystic", era: "Chapter 1", expansion: "The Innsmouth Conspiracy" },
  { id: "c1-silas", character: "Silas Marsh", name: "Silas Marsh", subtitle: "The Sailor", cls: "Survivor", era: "Chapter 1", expansion: "The Innsmouth Conspiracy" },
  // === CHAPTER 1: EDGE OF THE EARTH ===
  { id: "c1-daniela", character: "Daniela Reyes", name: "Daniela Reyes", subtitle: "The Mechanic", cls: "Guardian", era: "Chapter 1", expansion: "Edge of the Earth" },
  { id: "c1-norman", character: "Norman Withers", name: "Norman Withers", subtitle: "The Astronomer", cls: "Seeker", era: "Chapter 1", expansion: "Edge of the Earth" },
  { id: "c1-monterey", character: "Monterey Jack", name: "Monterey Jack", subtitle: "The Archaeologist", cls: "Rogue", era: "Chapter 1", expansion: "Edge of the Earth" },
  { id: "c1-lily", character: "Lily Chen", name: "Lily Chen", subtitle: "The Martial Artist", cls: "Mystic", era: "Chapter 1", expansion: "Edge of the Earth" },
  { id: "c1-bob", character: "Bob Jenkins", name: "Bob Jenkins", subtitle: "The Salesman", cls: "Survivor", era: "Chapter 1", expansion: "Edge of the Earth" },
  // === CHAPTER 1: THE SCARLET KEYS ===
  { id: "c1-carson", character: "Carson Sinclair", name: "Carson Sinclair", subtitle: "The Butler", cls: "Guardian", era: "Chapter 1", expansion: "The Scarlet Keys" },
  { id: "c1-vincent", character: "Vincent Lee", name: "Vincent Lee", subtitle: "The Doctor", cls: "Seeker", era: "Chapter 1", expansion: "The Scarlet Keys" },
  { id: "c1-kymani", character: "Kymani Jones", name: "Kymani Jones", subtitle: "The Security Consultant", cls: "Rogue", era: "Chapter 1", expansion: "The Scarlet Keys" },
  { id: "c1-amina", character: "Amina Zidane", name: "Amina Zidane", subtitle: "The Operator", cls: "Mystic", era: "Chapter 1", expansion: "The Scarlet Keys" },
  { id: "c1-darrell", character: "Darrell Simmons", name: "Darrell Simmons", subtitle: "The Photographer", cls: "Survivor", era: "Chapter 1", expansion: "The Scarlet Keys" },
  { id: "c1-charlie", character: "Charlie Kane", name: "Charlie Kane", subtitle: "The Politician", cls: "Neutral", era: "Chapter 1", expansion: "The Scarlet Keys" },
  // === CHAPTER 1: THE FEAST OF HEMLOCK VALE ===
  { id: "c1-wilson", character: "Wilson Richards", name: "Wilson Richards", subtitle: "The Handyman", cls: "Guardian", era: "Chapter 1", expansion: "The Feast of Hemlock Vale" },
  { id: "c1-kate", character: "Kate Winthrop", name: "Kate Winthrop", subtitle: "The Scientist", cls: "Seeker", era: "Chapter 1", expansion: "The Feast of Hemlock Vale" },
  { id: "c1-alessandra", character: "Alessandra Zorzi", name: "Alessandra Zorzi", subtitle: "The Countess", cls: "Rogue", era: "Chapter 1", expansion: "The Feast of Hemlock Vale" },
  { id: "c1-kohaku", character: "Kōhaku Narukami", name: "Kōhaku Narukami", subtitle: "The Folklorist", cls: "Mystic", era: "Chapter 1", expansion: "The Feast of Hemlock Vale" },
  { id: "c1-hank", character: "Hank Samson", name: "Hank Samson", subtitle: "The Farmhand", cls: "Survivor", era: "Chapter 1", expansion: "The Feast of Hemlock Vale" },
  // === CHAPTER 1: THE DROWNED CITY ===
  { id: "c1-marion", character: "Marion Tavares", name: "Marion Tavares", subtitle: "The Trawler", cls: "Guardian", era: "Chapter 1", expansion: "The Drowned City" },
  { id: "c1-lucius", character: "Lucius Galloway", name: "Lucius Galloway", subtitle: "The Poet", cls: "Seeker", era: "Chapter 1", expansion: "The Drowned City" },
  { id: "c1-agatha-seeker", character: "Agatha Crane", name: "Agatha Crane (Seeker)", subtitle: "The Parapsychologist", cls: "Seeker", era: "Chapter 1", expansion: "The Drowned City" },
  { id: "c1-agatha-mystic", character: "Agatha Crane", name: "Agatha Crane (Mystic)", subtitle: "The Parapsychologist", cls: "Mystic", era: "Chapter 1", expansion: "The Drowned City" },
  { id: "c1-michael", character: "Michael McGlen", name: "Michael McGlen", subtitle: "The Gangster", cls: "Rogue", era: "Chapter 1", expansion: "The Drowned City" },
  { id: "c1-gloria", character: "Gloria Goldberg", name: "Gloria Goldberg", subtitle: "The Writer", cls: "Mystic", era: "Chapter 1", expansion: "The Drowned City" },
  { id: "c1-george", character: "George Barnaby", name: "George Barnaby", subtitle: "The Lawyer", cls: "Survivor", era: "Chapter 1", expansion: "The Drowned City" },
  // === PARALLEL INVESTIGATORS (13 OFFICIAL) ===
  { id: "par-roland", character: "Roland Banks", name: "Roland Banks (Parallel)", subtitle: "The Fed — By the Book", cls: "Guardian", era: "Parallel", expansion: "Parallel: By the Book" },
  { id: "par-daisy", character: "Daisy Walker", name: "Daisy Walker (Parallel)", subtitle: "The Librarian — Read or Die", cls: "Seeker", era: "Parallel", expansion: "Parallel: Read or Die" },
  { id: "par-skids", character: '"Skids" O\'Toole', name: '"Skids" O\'Toole (Parallel)', subtitle: "The Ex-Con — All or Nothing", cls: "Rogue", era: "Parallel", expansion: "Parallel: All or Nothing" },
  { id: "par-agnes", character: "Agnes Baker", name: "Agnes Baker (Parallel)", subtitle: "The Waitress — Bad Blood", cls: "Mystic", era: "Parallel", expansion: "Parallel: Bad Blood" },
  { id: "par-wendy", character: "Wendy Adams", name: "Wendy Adams (Parallel)", subtitle: "The Urchin — Red Tide Rising", cls: "Survivor", era: "Parallel", expansion: "Parallel: Red Tide Rising" },
  { id: "par-zoey", character: "Zoey Samaras", name: "Zoey Samaras (Parallel)", subtitle: "The Chef — Path of the Righteous", cls: "Guardian", era: "Parallel", expansion: "Parallel: Path of the Righteous" },
  { id: "par-rex", character: "Rex Murphy", name: "Rex Murphy (Parallel)", subtitle: "The Reporter — Hunting for Answers", cls: "Seeker", era: "Parallel", expansion: "Parallel: Hunting for Answers" },
  { id: "par-jenny", character: "Jenny Barnes", name: "Jenny Barnes (Parallel)", subtitle: "The Dilettante — Terror at the End of Time", cls: "Rogue", era: "Parallel", expansion: "Parallel: Terror at the End of Time" },
  { id: "par-jim", character: "Jim Culver", name: "Jim Culver (Parallel)", subtitle: "The Musician — Laid to Rest", cls: "Mystic", era: "Parallel", expansion: "Parallel: Laid to Rest" },
  { id: "par-pete", character: '"Ashcan" Pete', name: '"Ashcan" Pete (Parallel)', subtitle: "The Drifter — On the Road Again", cls: "Survivor", era: "Parallel", expansion: "Parallel: On the Road Again" },
  { id: "par-lola", character: "Lola Hayes", name: "Lola Hayes (Parallel)", subtitle: "The Actress — Pistols and Pearls", cls: "Neutral", era: "Parallel", expansion: "Parallel: Pistols and Pearls" },
  { id: "par-mateo", character: "Father Mateo", name: "Father Mateo (Parallel)", subtitle: "The Priest — Aura of Faith", cls: "Mystic", era: "Parallel", expansion: "Parallel: Aura of Faith" },
  { id: "par-monterey", character: "Monterey Jack", name: "Monterey Jack (Parallel)", subtitle: "The Archaeologist — Relics of the Past", cls: "Rogue", era: "Parallel", expansion: "Parallel: Relics of the Past" },
  // === CHAPTER 2: CORE SET (2026) ===
  { id: "c2-daniela", character: "Daniela Reyes", name: "Daniela Reyes (Ch. 2)", subtitle: "The Mechanic", cls: "Guardian", era: "Chapter 2", expansion: "Core Set (Chapter 2)" },
  { id: "c2-joe", character: "Joe Diamond", name: "Joe Diamond (Ch. 2)", subtitle: "The Private Investigator", cls: "Seeker", era: "Chapter 2", expansion: "Core Set (Chapter 2)" },
  { id: "c2-trish", character: "Trish Scarborough", name: "Trish Scarborough (Ch. 2)", subtitle: "The Spy", cls: "Rogue", era: "Chapter 2", expansion: "Core Set (Chapter 2)" },
  { id: "c2-dexter", character: "Dexter Drake", name: "Dexter Drake (Ch. 2)", subtitle: "The Magician", cls: "Mystic", era: "Chapter 2", expansion: "Core Set (Chapter 2)" },
  { id: "c2-isabelle", character: "Isabelle Barnes", name: "Isabelle Barnes (Ch. 2)", subtitle: "The Returned", cls: "Survivor", era: "Chapter 2", expansion: "Core Set (Chapter 2)" },
  // === CHAPTER 2: INVESTIGATOR DECKS (2026) ===
  { id: "c2-tommy", character: "Tommy Muldoon", name: "Tommy Muldoon (Ch. 2)", subtitle: "The Officer", cls: "Guardian", era: "Chapter 2", expansion: "Chapter 2 Investigator Decks" },
  { id: "c2-carolyn", character: "Carolyn Fern", name: "Carolyn Fern (Ch. 2)", subtitle: "The Psychologist", cls: "Seeker", era: "Chapter 2", expansion: "Chapter 2 Investigator Decks" },
  { id: "c2-andre", character: "André Patel", name: "André Patel (Ch. 2)", subtitle: "The Film Star", cls: "Rogue", era: "Chapter 2", expansion: "Chapter 2 Investigator Decks" },
  { id: "c2-marie", character: "Marie Lambeau", name: "Marie Lambeau (Ch. 2)", subtitle: "The Entertainer", cls: "Mystic", era: "Chapter 2", expansion: "Chapter 2 Investigator Decks" },
  { id: "c2-miguel", character: "Miguel de la Cruz", name: "Miguel de la Cruz (Ch. 2)", subtitle: "The Rancher", cls: "Survivor", era: "Chapter 2", expansion: "Chapter 2 Investigator Decks" },
];

const SUZI_INVESTIGATOR: Investigator = {
  id: "bonus-suzi",
  character: "Subject 5U-21",
  name: 'Subject 5U-21 ("Suzi")',
  subtitle: "The Anomaly",
  cls: "Neutral",
  era: "Bonus",
  expansion: "The Blob That Ate Everything Else!",
};

const ROLES: RoleDef[] = [
  { key: "Cluever", label: "Cluever", desc: "Clues & Investigation", color: "#c97a16", badgeBg: "rgba(201, 122, 22, 0.25)", badgeBorder: "rgba(245, 166, 35, 0.6)", badgeText: "#ffd285" },
  { key: "Fighter", label: "Fighter", desc: "Monsters & Combat", color: "#9e2a2b", badgeBg: "rgba(158, 42, 43, 0.28)", badgeBorder: "rgba(231, 76, 60, 0.6)", badgeText: "#ffaba3" },
  { key: "Flex", label: "Flex", desc: "Flexible All-Rounder", color: "#1e7a48", badgeBg: "rgba(30, 122, 72, 0.25)", badgeBorder: "rgba(46, 204, 113, 0.6)", badgeText: "#84f0b1" },
  { key: "Support", label: "Support", desc: "Support, Healing & Utility", color: "#6b3282", badgeBg: "rgba(107, 50, 130, 0.28)", badgeBorder: "rgba(175, 115, 210, 0.6)", badgeText: "#dfb5f7" },
];

const OFFICIAL_CAMPAIGNS: OfficialCampaign[] = [
  { id: "camp-dunwich", baseName: "The Dunwich Legacy", hasReturn: true, note: "8 Scenarios • Classic Miskatonic & Dunwich horror", color: "#245d42" },
  { id: "camp-carcosa", baseName: "The Path to Carcosa", hasReturn: true, note: "8 Scenarios • Sanity-warping theatrical mystery", color: "#5c2c6d" },
  { id: "camp-tfa", baseName: "The Forgotten Age", hasReturn: true, note: "8 Scenarios • Brutal jungle expedition & supplies", color: "#9a581c" },
  { id: "camp-tcu", baseName: "The Circle Undone", hasReturn: true, note: "8 Scenarios • Witchcraft, Silver Twilight & hauntings", color: "#2c4270" },
  { id: "camp-tde", baseName: "The Dream-Eaters", hasReturn: false, note: "8 Scenarios (Two 4-part interconnected campaigns)", color: "#4c3475" },
  { id: "camp-tic", baseName: "The Innsmouth Conspiracy", hasReturn: false, note: "8 Scenarios • Flashbacks, floods & Deep Ones", color: "#1b5c63" },
  { id: "camp-eote", baseName: "Edge of the Earth", hasReturn: false, note: "8 Scenarios • Antarctic expedition & massive maps", color: "#2f5a78" },
  { id: "camp-tsk", baseName: "The Scarlet Keys", hasReturn: false, note: "Globe-trotting nonlinear campaign & Coterie", color: "#7d222a" },
  { id: "camp-fhv", baseName: "The Feast of Hemlock Vale", hasReturn: false, note: "Day/Night prelude & folk-horror island festival", color: "#6b5e21" },
  { id: "camp-tdc", baseName: "The Drowned City", hasReturn: false, note: "8 Scenarios • R'lyeh rises from the depths", color: "#18544a" },
];

const LIMITED_EXPANSIONS: LimitedExpansion[] = [
  { id: "exp-dunwich", name: "The Dunwich Legacy", hasReturn: true, color: "#245d42" },
  { id: "exp-carcosa", name: "The Path to Carcosa", hasReturn: true, color: "#5c2c6d" },
  { id: "exp-tfa", name: "The Forgotten Age", hasReturn: true, color: "#9a581c" },
  { id: "exp-tcu", name: "The Circle Undone", hasReturn: true, color: "#2c4270" },
  { id: "exp-tde", name: "The Dream-Eaters", hasReturn: false, color: "#4c3475" },
  { id: "exp-tic", name: "The Innsmouth Conspiracy", hasReturn: false, color: "#1b5c63" },
  { id: "exp-eote", name: "Edge of the Earth", hasReturn: false, color: "#2f5a78" },
  { id: "exp-tsk", name: "The Scarlet Keys", hasReturn: false, color: "#7d222a" },
  { id: "exp-fhv", name: "The Feast of Hemlock Vale", hasReturn: false, color: "#6b5e21" },
  { id: "exp-tdc", name: "The Drowned City", hasReturn: false, color: "#18544a" },
];

const STORAGE_KEYS = {
  CUSTOM_INV: "arkham_wheel_custom_investigators_v1",
  CUSTOM_CAMP: "arkham_wheel_custom_campaigns_v1",
  RESTORE: "arkham_wheel_restore_point_v3",
};

// Reusable Lovecraftian / Art Deco Tailwind class tokens (no <style> tags)
const PANEL_CLS =
  "bg-[linear-gradient(180deg,rgba(20,26,37,0.94)_0%,rgba(12,16,23,0.97)_100%)] border border-[#c8a45d]/25 shadow-[0_12px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(235,210,155,0.08)]";

const SPIN_BTN_CLS =
  "bg-[linear-gradient(180deg,#d7b46a_0%,#9b7735_100%)] text-[#0b0e14] border border-[#f2dcab] shadow-[0_6px_24px_rgba(200,164,93,0.3),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:enabled:-translate-y-[1px] hover:enabled:brightness-110 hover:enabled:shadow-[0_8px_28px_rgba(200,164,93,0.45),inset_0_1px_2px_rgba(255,255,255,0.6)] active:enabled:translate-y-[1px] disabled:opacity-45 disabled:cursor-not-allowed transition-all";

/*****************************************************************************
 * 3. HELPER COMPONENTS & CANVAS ENGINE
 *****************************************************************************/
function ClassIcon({ cls }: { cls: InvestigatorClass }) {
  switch (cls) {
    case "Guardian":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z" />
        </svg>
      );
    case "Seeker":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M20 20l-4.2-4.2" />
        </svg>
      );
    case "Rogue":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7l3-7z" />
        </svg>
      );
    case "Mystic":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "Survivor":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c2 3.5 5 5.5 5 10a5 5 0 11-10 0c0-2.5 1.5-4.8 3-6.5 0 2 1.2 3 2 3.5 0-2.5 0-5 0-7z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v5l3 3" />
        </svg>
      );
  }
}

function ToggleSwitch({
  checked,
  onChange,
  title,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  title: string;
  description: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="w-full flex items-start justify-between gap-3 text-left cursor-pointer select-none disabled:opacity-50"
    >
      <div>
        <div className="text-sm font-medium text-amber-50">{title}</div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
      <div
        className={`relative shrink-0 mt-0.5 w-10 h-5 rounded-full border transition-colors flex items-center px-0.5 ${
          checked ? "bg-[#b58d42] border-[#ebd29b]" : "bg-slate-800 border-slate-600"
        }`}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full transition-transform ${
            checked ? "translate-x-[18px] bg-[#fff8e7]" : "translate-x-0 bg-slate-400"
          }`}
        />
      </div>
    </button>
  );
}

function getIndexUnderPointer(rotation: number, count: number): number {
  if (count <= 0) return -1;
  const sliceAngle = (Math.PI * 2) / count;
  const pointerAngle = -Math.PI / 2;
  let normalized = (pointerAngle - rotation) % (Math.PI * 2);
  if (normalized < 0) normalized += Math.PI * 2;
  return Math.floor(normalized / sliceAngle) % count;
}

function drawGenericWheel<T>(
  canvasEl: HTMLCanvasElement | null,
  wrapperEl: HTMLDivElement | null,
  items: T[],
  rotation: number,
  getColor: (item: T, idx: number) => string,
  getLabel: (item: T) => string,
  emptyTitle: string,
  emptySubtitle: string
) {
  if (!canvasEl || !wrapperEl) return;
  const rect = wrapperEl.getBoundingClientRect();
  if (rect.width < 20 || rect.height < 20) return;

  const size = Math.max(220, Math.floor(Math.min(rect.width, rect.height)));
  const dpr = window.devicePixelRatio || 1;
  const pixelSize = Math.round(size * dpr);
  if (canvasEl.width !== pixelSize || canvasEl.height !== pixelSize) {
    canvasEl.width = pixelSize;
    canvasEl.height = pixelSize;
  }

  const c = canvasEl.getContext("2d");
  if (!c) return;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, size, size);

  const n = items.length;
  const cx = size / 2;
  const cy = size / 2;
  const outerRimRadius = size / 2 - 4;
  const wheelRadius = outerRimRadius - 10;

  // Ornate dark brass outer ring
  c.save();
  c.beginPath();
  c.arc(cx, cy, outerRimRadius, 0, Math.PI * 2);
  const rimGrad = c.createRadialGradient(cx, cy, wheelRadius - 2, cx, cy, outerRimRadius);
  rimGrad.addColorStop(0, "#5a4320");
  rimGrad.addColorStop(0.55, "#c8a45d");
  rimGrad.addColorStop(1, "#3d2c12");
  c.fillStyle = rimGrad;
  c.fill();
  c.restore();

  if (n === 0) {
    c.save();
    c.beginPath();
    c.arc(cx, cy, wheelRadius, 0, Math.PI * 2);
    c.fillStyle = "#0f141d";
    c.fill();
    c.fillStyle = "#939aa8";
    c.font = "600 13px Cinzel, serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(emptyTitle, cx, cy - 48);
    c.font = "400 12px Inter, sans-serif";
    c.fillText(emptySubtitle, cx, cy + 54);
    c.restore();
    return;
  }

  const sliceAngle = (Math.PI * 2) / n;
  let fontSize = 14;
  if (n > 70) fontSize = Math.max(7.2, size * 0.0155);
  else if (n > 50) fontSize = Math.max(8.5, size * 0.018);
  else if (n > 30) fontSize = Math.max(10, size * 0.021);
  else if (n > 14) fontSize = Math.max(11.5, size * 0.024);
  else fontSize = Math.max(12.5, size * 0.027);

  for (let i = 0; i < n; i++) {
    const item = items[i];
    const startAngle = rotation + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    c.save();
    c.beginPath();
    c.moveTo(cx, cy);
    c.arc(cx, cy, wheelRadius, startAngle, endAngle);
    c.closePath();

    c.fillStyle = getColor(item, i);
    c.fill();
    c.strokeStyle = "rgba(235, 210, 155, 0.3)";
    c.lineWidth = n > 50 ? 0.7 : 1.25;
    c.stroke();

    c.translate(cx, cy);
    c.rotate(startAngle + sliceAngle / 2);
    c.textAlign = "right";
    c.textBaseline = "middle";
    c.font = `600 ${fontSize}px Inter, sans-serif`;
    c.fillStyle = "#f8f5ee";
    c.shadowColor = "rgba(0, 0, 0, 0.8)";
    c.shadowBlur = 2.5;

    let label = getLabel(item);
    const maxLen = n > 60 ? 22 : n <= 14 ? 26 : 24;
    if (label.length > maxLen) label = label.slice(0, maxLen - 1) + "…";
    c.fillText(label, wheelRadius - 12, 0);
    c.restore();
  }

  // Inner shadow vignette
  c.save();
  const innerGrad = c.createRadialGradient(cx, cy, wheelRadius * 0.15, cx, cy, wheelRadius);
  innerGrad.addColorStop(0, "rgba(0, 0, 0, 0.45)");
  innerGrad.addColorStop(0.25, "rgba(0, 0, 0, 0.0)");
  innerGrad.addColorStop(0.88, "rgba(0, 0, 0, 0.08)");
  innerGrad.addColorStop(1, "rgba(0, 0, 0, 0.45)");
  c.beginPath();
  c.arc(cx, cy, wheelRadius, 0, Math.PI * 2);
  c.fillStyle = innerGrad;
  c.fill();
  c.restore();

  // Brass rim pegs
  const pegCount = Math.min(Math.max(n, 12), 48);
  const pegStep = (Math.PI * 2) / pegCount;
  for (let p = 0; p < pegCount; p++) {
    const angle = rotation + p * pegStep;
    const px = cx + Math.cos(angle) * (outerRimRadius - 5);
    const py = cy + Math.sin(angle) * (outerRimRadius - 5);
    c.beginPath();
    c.arc(px, py, 2.2, 0, Math.PI * 2);
    c.fillStyle = "#f7e5b7";
    c.fill();
  }
}

/*****************************************************************************
 * 4. MAIN NEXT.JS PAGE COMPONENT
 *****************************************************************************/
export default function App() {
  // Global UI state
  const [activeTab, setActiveTab] = useState<TabKey>("investigators");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [restorePointSavedAt, setRestorePointSavedAt] = useState<string | null>(null);

  // Tab 1: Investigators & Balanced Roles
  const [partySize, setPartySize] = useState<number>(4);
  const [smartRoleBalance, setSmartRoleBalance] = useState<boolean>(true);
  const [enabledEras, setEnabledEras] = useState<("Chapter 1" | "Parallel" | "Chapter 2")[]>([
    "Chapter 1",
    "Parallel",
    "Chapter 2",
  ]);
  const [enabledClasses, setEnabledClasses] = useState<InvestigatorClass[]>([...CLASS_ORDER]);
  const [includeSuzi, setIncludeSuzi] = useState<boolean>(false);
  const [customInvestigators, setCustomInvestigators] = useState<Investigator[]>([]);
  const [manuallyExcludedIds, setManuallyExcludedIds] = useState<string[]>([]);
  const [ruleNoRepeat, setRuleNoRepeat] = useState<boolean>(true);
  const [ruleUniqueCharacter, setRuleUniqueCharacter] = useState<boolean>(true);
  const [ruleUniqueClass, setRuleUniqueClass] = useState<boolean>(false);
  const [drawnParty, setDrawnParty] = useState<DraftedInvestigator[]>([]);
  const [selectedPartyIdx, setSelectedPartyIdx] = useState<number | null>(null);
  const [invOrder, setInvOrder] = useState<string[]>(() => INVESTIGATORS.map((i) => i.id));
  const [rosterSearch, setRosterSearch] = useState<string>("");
  const [isInvSpinning, setIsInvSpinning] = useState<boolean>(false);
  const [isRoleSpinning, setIsRoleSpinning] = useState<boolean>(false);

  // Tab 2: Campaigns Wheel
  const [campSplitReturn, setCampSplitReturn] = useState<boolean>(false);
  const [campNoRepeat, setCampNoRepeat] = useState<boolean>(true);
  const [customCampaigns, setCustomCampaigns] = useState<CustomCampaign[]>([]);
  const [campExcludedIds, setCampExcludedIds] = useState<string[]>([]);
  const [drawnCampaigns, setDrawnCampaigns] = useState<CampaignEntry[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignEntry | null>(null);
  const [campOrder, setCampOrder] = useState<string[]>([]);
  const [isCampSpinning, setIsCampSpinning] = useState<boolean>(false);

  // Custom Campaign Form State
  const [editCampId, setEditCampId] = useState<string>("");
  const [customCampName, setCustomCampName] = useState<string>("");
  const [customCampNote, setCustomCampNote] = useState<string>("");

  // Tab 3: Limited Pool Wheel
  const [limMode, setLimMode] = useState<LimitedMode>("individual");
  const [limActivePlayerIdx, setLimActivePlayerIdx] = useState<number>(0);
  const [limOwnedIds, setLimOwnedIds] = useState<string[]>(() =>
    LIMITED_EXPANSIONS.map((e) => e.id)
  );
  const [limSharedPool, setLimSharedPool] = useState<LimitedExpansion[]>([]);
  const [limPlayerPools, setLimPlayerPools] = useState<LimitedExpansion[][]>([[], [], [], []]);
  const [isLimSpinning, setIsLimSpinning] = useState<boolean>(false);

  // Update Modal Form & Sync State
  const [isSyncingDb, setIsSyncingDb] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>("");
  const [newInvName, setNewInvName] = useState<string>("");
  const [newInvSubtitle, setNewInvSubtitle] = useState<string>("");
  const [newInvClass, setNewInvClass] = useState<InvestigatorClass>("Guardian");
  const [newInvEra, setNewInvEra] = useState<"Chapter 1" | "Parallel" | "Chapter 2">("Chapter 2");
  const [newInvExpansion, setNewInvExpansion] = useState<string>("");

  // Refs for Canvas, Rotations, Audio & Pointer bounce
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef<boolean>(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const invCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const invWrapperRef = useRef<HTMLDivElement | null>(null);
  const invPointerRef = useRef<HTMLDivElement | null>(null);
  const invRotationRef = useRef<number>(0);

  const roleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rolePointerRef = useRef<HTMLDivElement | null>(null);
  const roleRotationRef = useRef<number>(0);

  const campCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const campWrapperRef = useRef<HTMLDivElement | null>(null);
  const campPointerRef = useRef<HTMLDivElement | null>(null);
  const campRotationRef = useRef<number>(0);

  const limCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const limWrapperRef = useRef<HTMLDivElement | null>(null);
  const limPointerRef = useRef<HTMLDivElement | null>(null);
  const limRotationRef = useRef<number>(0);

  // Load Cinzel display font on client mount (avoids next/font bundler issues & SSR hydration mismatches)
  useEffect(() => {
    const linkId = "arkham-cinzel-font";
    if (typeof document !== "undefined" && !document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // Hydrate persisted custom items on client mount ONLY (prevents SSR hydration mismatch)
  useEffect(() => {
    try {
      const savedInv = localStorage.getItem(STORAGE_KEYS.CUSTOM_INV);
      if (savedInv) {
        const parsed = JSON.parse(savedInv);
        if (Array.isArray(parsed)) setCustomInvestigators(parsed);
      }
      const savedCamp = localStorage.getItem(STORAGE_KEYS.CUSTOM_CAMP);
      if (savedCamp) {
        const parsed = JSON.parse(savedCamp);
        if (Array.isArray(parsed)) setCustomCampaigns(parsed);
      }
      const savedRestore = localStorage.getItem(STORAGE_KEYS.RESTORE);
      if (savedRestore) {
        const snap = JSON.parse(savedRestore) as RestoreSnapshot;
        if (snap?.savedAt) setRestorePointSavedAt(snap.savedAt);
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  // Toast helper
  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2900);
  }, []);

  // Web Audio Synthesizer
  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (!soundEnabledRef.current || typeof window === "undefined") return null;
    try {
      if (!audioCtxRef.current) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AC();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  const playTickSound = useCallback(() => {
    const ac = ensureAudioContext();
    if (!ac) return;
    try {
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(680 + Math.random() * 90, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.032);
      gain.gain.setValueAtTime(0.085, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.038);
    } catch {
      // Ignore audio glitches
    }
  }, [ensureAudioContext]);

  const playRevealChime = useCallback(() => {
    const ac = ensureAudioContext();
    if (!ac) return;
    try {
      const now = ac.currentTime;
      const freqs = [293.66, 349.23, 440.0, 587.33];
      freqs.forEach((f, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(f, now + idx * 0.045);
        gain.gain.setValueAtTime(0.001, now + idx * 0.045);
        gain.gain.linearRampToValueAtTime(0.065, now + idx * 0.045 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.045 + 1.25);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 1.3);
      });
    } catch {
      // Ignore audio glitches
    }
  }, [ensureAudioContext]);

  const bouncePointer = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    el.style.transform = "translateX(-50%) rotate(-14deg)";
    setTimeout(() => {
      if (el) el.style.transform = "translateX(-50%) rotate(0deg)";
    }, 90);
  }, []);

  const animateWheelSpin = useCallback(
    <T,>({
      items,
      startRotation,
      durationMs,
      extraTurnsRange,
      pointerEl,
      onFrame,
      onComplete,
    }: {
      items: T[];
      startRotation: number;
      durationMs: number;
      extraTurnsRange: [number, number];
      pointerEl: HTMLDivElement | null;
      onFrame: (rot: number) => void;
      onComplete: (finalRot: number, winner: T | undefined) => void;
    }) => {
      ensureAudioContext();
      const extraTurns =
        (extraTurnsRange[0] +
          Math.floor(Math.random() * (extraTurnsRange[1] - extraTurnsRange[0] + 1))) *
        Math.PI *
        2;
      const randomOffset = Math.random() * Math.PI * 2;
      const targetRotation = startRotation + extraTurns + randomOffset;
      const startTime = performance.now();
      let lastSliceIdx = getIndexUnderPointer(startRotation, items.length);

      const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / durationMs, 1);
        const currentRot = startRotation + (targetRotation - startRotation) * easeOutQuint(progress);
        onFrame(currentRot);

        const currentIdx = getIndexUnderPointer(currentRot, items.length);
        if (currentIdx !== lastSliceIdx) {
          lastSliceIdx = currentIdx;
          playTickSound();
          bouncePointer(pointerEl);
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          const finalRot = currentRot % (Math.PI * 2);
          const winIdx = getIndexUnderPointer(finalRot, items.length);
          onComplete(finalRot, items[winIdx]);
        }
      };

      requestAnimationFrame(step);
    },
    [ensureAudioContext, playTickSound, bouncePointer]
  );

  /***************************************************************************
   * 5. DERIVED DATA — TAB 1 (INVESTIGATORS & SMART ROLE BALANCE)
   ***************************************************************************/
  const allInvestigators = useMemo(() => {
    const list: Investigator[] = [...INVESTIGATORS];
    if (includeSuzi) list.push(SUZI_INVESTIGATOR);
    if (customInvestigators.length > 0) list.push(...customInvestigators);
    return list;
  }, [includeSuzi, customInvestigators]);

  const orderedInvestigators = useMemo(() => {
    const byId = new Map(allInvestigators.map((i) => [i.id, i]));
    const seen = new Set<string>();
    const result: Investigator[] = [];
    invOrder.forEach((id) => {
      const inv = byId.get(id);
      if (inv && !seen.has(id)) {
        seen.add(id);
        result.push(inv);
      }
    });
    allInvestigators.forEach((inv) => {
      if (!seen.has(inv.id)) {
        seen.add(inv.id);
        result.push(inv);
      }
    });
    return result;
  }, [allInvestigators, invOrder]);

  const isExcludedByPartyRules = useCallback(
    (inv: Investigator) => {
      if (drawnParty.length === 0) return false;
      if (ruleNoRepeat && drawnParty.some((d) => d.id === inv.id)) return true;
      if (ruleUniqueCharacter && drawnParty.some((d) => d.character === inv.character)) return true;
      if (ruleUniqueClass && drawnParty.some((d) => d.cls === inv.cls)) return true;
      return false;
    },
    [drawnParty, ruleNoRepeat, ruleUniqueCharacter, ruleUniqueClass]
  );

  const activeInvestigators = useMemo(() => {
    const eraSet = new Set<InvestigatorEra>(enabledEras);
    const clsSet = new Set<InvestigatorClass>(enabledClasses);
    const manualSet = new Set(manuallyExcludedIds);

    return orderedInvestigators.filter((inv) => {
      const eraAllowed = inv.era === "Bonus" ? includeSuzi : eraSet.has(inv.era);
      return (
        eraAllowed &&
        clsSet.has(inv.cls) &&
        !manualSet.has(inv.id) &&
        !isExcludedByPartyRules(inv)
      );
    });
  }, [
    orderedInvestigators,
    enabledEras,
    enabledClasses,
    includeSuzi,
    manuallyExcludedIds,
    isExcludedByPartyRules,
  ]);

  const focusedPartyIdx: number | null =
    selectedPartyIdx !== null && drawnParty[selectedPartyIdx]
      ? selectedPartyIdx
      : drawnParty.length > 0
      ? drawnParty.length - 1
      : null;

  const focusedInvestigator: DraftedInvestigator | null =
    focusedPartyIdx !== null ? drawnParty[focusedPartyIdx] : null;

  // Smart Role Balance Engine
  const allowedRolesInfo = useMemo(() => {
    if (!smartRoleBalance) {
      return { roles: [...ROLES], note: "" };
    }
    const others = drawnParty.filter((p) => p !== focusedInvestigator && p.assignedRole);
    const counts: Record<RoleDef["key"], number> = {
      Cluever: 0,
      Fighter: 0,
      Flex: 0,
      Support: 0,
    };
    others.forEach((p) => {
      if (p.assignedRole) counts[p.assignedRole.key]++;
    });

    const maxSupport = 1;
    const maxCluever = partySize <= 2 ? 1 : 2;
    const maxFighter = partySize <= 2 ? 1 : 2;
    const reasons: string[] = [];

    let allowed = ROLES.filter((r) => {
      if (r.key === "Support" && counts.Support >= maxSupport) {
        reasons.push("Support capped (1/1)");
        return false;
      }
      if (r.key === "Cluever" && counts.Cluever >= maxCluever) {
        reasons.push(`Cluever capped (${maxCluever}/${maxCluever})`);
        return false;
      }
      if (r.key === "Fighter" && counts.Fighter >= maxFighter) {
        reasons.push(`Fighter capped (${maxFighter}/${maxFighter})`);
        return false;
      }
      return true;
    });

    const isLastSlot = others.length >= partySize - 1;
    if (isLastSlot) {
      const hasClueCapable = counts.Cluever > 0 || counts.Flex > 0;
      const hasFightCapable = counts.Fighter > 0 || counts.Flex > 0;

      if (!hasClueCapable && !hasFightCapable) {
        allowed = allowed.filter((r) => r.key === "Flex");
        reasons.push("Last slot requires Flex (Clue + Combat coverage)");
      } else if (!hasClueCapable) {
        allowed = allowed.filter((r) => r.key === "Cluever" || r.key === "Flex");
        reasons.push("Last slot guarantees Clue coverage (Cluever/Flex)");
      } else if (!hasFightCapable && partySize >= 3) {
        allowed = allowed.filter((r) => r.key === "Fighter" || r.key === "Flex");
        reasons.push("Last slot guarantees Enemy coverage (Fighter/Flex)");
      }
    }

    if (allowed.length === 0) allowed = [...ROLES];
    return { roles: allowed, note: reasons.join(" • ") };
  }, [smartRoleBalance, drawnParty, focusedInvestigator, partySize]);

  /***************************************************************************
   * 6. DERIVED DATA — TAB 2 (FULL CAMPAIGNS + RETURN TO + CUSTOM)
   ***************************************************************************/
  const allCampaignEntries = useMemo<CampaignEntry[]>(() => {
    const entries: CampaignEntry[] = [];
    OFFICIAL_CAMPAIGNS.forEach((c) => {
      if (c.hasReturn && !campSplitReturn) {
        entries.push({
          id: `${c.id}-ret`,
          name: `Return to ${c.baseName}`,
          shortName: `Return to ${c.baseName}`,
          note: `${c.note} • Includes Return To upgrade`,
          color: c.color,
          tag: "Official Campaign (Return To)",
          isCustom: false,
        });
      } else if (c.hasReturn && campSplitReturn) {
        entries.push({
          id: `${c.id}-std`,
          name: c.baseName,
          shortName: c.baseName,
          note: `${c.note} • Standard Edition`,
          color: c.color,
          tag: "Official Campaign (Standard)",
          isCustom: false,
        });
        entries.push({
          id: `${c.id}-ret`,
          name: `Return to ${c.baseName}`,
          shortName: `Return: ${c.baseName.replace("The ", "")}`,
          note: `${c.note} • Return To Edition`,
          color: "#7a5c28",
          tag: "Official Campaign (Return To)",
          isCustom: false,
        });
      } else {
        entries.push({
          id: c.id,
          name: c.baseName,
          shortName: c.baseName,
          note: c.note,
          color: c.color,
          tag: "Official Full Campaign",
          isCustom: false,
        });
      }
    });

    customCampaigns.forEach((cc) => {
      entries.push({
        id: cc.id,
        name: cc.name,
        shortName: cc.name,
        note: cc.note || "Custom Campaign",
        color: "#6e4c36",
        tag: "Custom Campaign",
        isCustom: true,
      });
    });

    return entries;
  }, [campSplitReturn, customCampaigns]);

  const orderedCampaigns = useMemo(() => {
    const byId = new Map(allCampaignEntries.map((c) => [c.id, c]));
    const seen = new Set<string>();
    const result: CampaignEntry[] = [];
    campOrder.forEach((id) => {
      const camp = byId.get(id);
      if (camp && !seen.has(id)) {
        seen.add(id);
        result.push(camp);
      }
    });
    allCampaignEntries.forEach((camp) => {
      if (!seen.has(camp.id)) {
        seen.add(camp.id);
        result.push(camp);
      }
    });
    return result;
  }, [allCampaignEntries, campOrder]);

  const activeCampaigns = useMemo(() => {
    const exclSet = new Set(campExcludedIds);
    const drawnSet = new Set(drawnCampaigns.map((d) => d.id));
    return orderedCampaigns.filter((c) => {
      if (exclSet.has(c.id)) return false;
      if (campNoRepeat && drawnSet.has(c.id)) return false;
      return true;
    });
  }, [orderedCampaigns, campExcludedIds, drawnCampaigns, campNoRepeat]);

  /***************************************************************************
   * 7. DERIVED DATA — TAB 3 (LIMITED 3-EXPANSION POOL)
   ***************************************************************************/
  const safeLimPlayerIdx = limActivePlayerIdx >= partySize ? 0 : limActivePlayerIdx;

  const currentLimPool = useMemo(() => {
    return limMode === "shared" ? limSharedPool : limPlayerPools[safeLimPlayerIdx] || [];
  }, [limMode, limSharedPool, limPlayerPools, safeLimPlayerIdx]);

  const activeLimitedExpansions = useMemo(() => {
    const ownedSet = new Set(limOwnedIds);
    const pickedSet = new Set(currentLimPool.map((e) => e.id));
    return LIMITED_EXPANSIONS.filter((e) => ownedSet.has(e.id) && !pickedSet.has(e.id));
  }, [limOwnedIds, currentLimPool]);

  const getPlayerDisplayLabel = useCallback(
    (idx: number) => {
      const drafted = drawnParty[idx];
      return drafted ? `P${idx + 1}: ${drafted.name}` : `Player ${idx + 1}`;
    },
    [drawnParty]
  );

  /***************************************************************************
   * 8. CANVAS RENDERERS & RESIZE OBSERVERS
   ***************************************************************************/
  const renderInvWheelCanvas = useCallback(
    (rot = invRotationRef.current) => {
      drawGenericWheel(
        invCanvasRef.current,
        invWrapperRef.current,
        activeInvestigators,
        rot,
        (inv, i) => {
          const meta = CLASS_META[inv.cls] || CLASS_META.Neutral;
          return i % 2 === 0 ? meta.color : meta.altColor;
        },
        (inv) => inv.name,
        "NO INVESTIGATORS ACTIVE",
        "Adjust filters or clear drafted party"
      );
    },
    [activeInvestigators]
  );

  const renderRoleWheelCanvas = useCallback(
    (rot = roleRotationRef.current) => {
      const canvas = roleCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = 156;
      const dpr = window.devicePixelRatio || 1;
      const pixelSize = Math.round(size * dpr);
      if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
        canvas.width = pixelSize;
        canvas.height = pixelSize;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const roles = allowedRolesInfo.roles;
      const cx = size / 2;
      const cy = size / 2;
      const outerR = size / 2 - 2;
      const wheelR = outerR - 4;
      const sliceAngle = (Math.PI * 2) / roles.length;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.fillStyle = "#b58d42";
      ctx.fill();

      roles.forEach((role, i) => {
        const start = rot + i * sliceAngle;
        const end = start + sliceAngle;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, wheelR, start, end);
        ctx.closePath();
        ctx.fillStyle = role.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(235, 210, 155, 0.45)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.translate(cx, cy);
        ctx.rotate(start + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.font = "700 11px Inter, sans-serif";
        ctx.fillStyle = "#fff9ee";
        ctx.shadowColor = "rgba(0,0,0,0.85)";
        ctx.shadowBlur = 2.5;
        ctx.fillText(role.label, wheelR - 10, 0);
        ctx.restore();
      });
    },
    [allowedRolesInfo]
  );

  const renderCampWheelCanvas = useCallback(
    (rot = campRotationRef.current) => {
      drawGenericWheel(
        campCanvasRef.current,
        campWrapperRef.current,
        activeCampaigns,
        rot,
        (c) => c.color,
        (c) => c.shortName,
        "NO CAMPAIGNS ACTIVE",
        "Enable campaigns or clear history"
      );
    },
    [activeCampaigns]
  );

  const renderLimWheelCanvas = useCallback(
    (rot = limRotationRef.current) => {
      const items = currentLimPool.length >= 3 ? [] : activeLimitedExpansions;
      const emptyTitle =
        currentLimPool.length >= 3 ? "3 EXPANSIONS DRAFTED" : "NO EXPANSIONS AVAILABLE";
      const emptySub =
        currentLimPool.length >= 3
          ? "Clear pool or switch player to draft more"
          : "Enable owned expansions on the left";

      drawGenericWheel(
        limCanvasRef.current,
        limWrapperRef.current,
        items,
        rot,
        (e) => e.color,
        (e) => e.name,
        emptyTitle,
        emptySub
      );
    },
    [currentLimPool, activeLimitedExpansions]
  );

  // Trigger canvas redraws whenever visible data or activeTab changes
  useEffect(() => {
    if (activeTab === "investigators") {
      renderInvWheelCanvas();
      renderRoleWheelCanvas();
    } else if (activeTab === "campaigns") {
      renderCampWheelCanvas();
    } else if (activeTab === "limited") {
      renderLimWheelCanvas();
    }
  }, [
    activeTab,
    renderInvWheelCanvas,
    renderRoleWheelCanvas,
    renderCampWheelCanvas,
    renderLimWheelCanvas,
    focusedInvestigator,
  ]);

  // Responsive ResizeObserver for active canvases
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (activeTab === "investigators") renderInvWheelCanvas();
      else if (activeTab === "campaigns") renderCampWheelCanvas();
      else if (activeTab === "limited") renderLimWheelCanvas();
    });
    if (invWrapperRef.current) ro.observe(invWrapperRef.current);
    if (campWrapperRef.current) ro.observe(campWrapperRef.current);
    if (limWrapperRef.current) ro.observe(limWrapperRef.current);
    return () => ro.disconnect();
  }, [activeTab, renderInvWheelCanvas, renderCampWheelCanvas, renderLimWheelCanvas]);

  /***************************************************************************
   * 9. SPIN ACTIONS
   ***************************************************************************/
  const handleSpinInvestigator = () => {
    if (isInvSpinning) return;
    if (activeInvestigators.length === 0) {
      showToast("No investigators available! Adjust filters or clear your party.", "warn");
      return;
    }
    setIsInvSpinning(true);
    const snapshotItems = [...activeInvestigators];

    animateWheelSpin({
      items: snapshotItems,
      startRotation: invRotationRef.current,
      durationMs: 4800 + Math.random() * 1200,
      extraTurnsRange: [6, 9],
      pointerEl: invPointerRef.current,
      onFrame: (rot) => {
        invRotationRef.current = rot;
        renderInvWheelCanvas(rot);
      },
      onComplete: (rot, winner) => {
        invRotationRef.current = rot;
        setIsInvSpinning(false);
        if (!winner) return;
        playRevealChime();
        const drafted: DraftedInvestigator = { ...winner, assignedRole: null };
        setDrawnParty((prev) => {
          const next = [...prev, drafted];
          setSelectedPartyIdx(next.length - 1);
          return next;
        });
        showToast(`Summoned: ${winner.name} (${winner.cls}) — Spin for their role!`, "success");
      },
    });
  };

  const handleSpinRole = () => {
    if (isRoleSpinning || focusedPartyIdx === null || !focusedInvestigator) return;
    const roles = [...allowedRolesInfo.roles];
    const targetIdx = focusedPartyIdx;
    const targetName = focusedInvestigator.name;
    setIsRoleSpinning(true);

    animateWheelSpin({
      items: roles,
      startRotation: roleRotationRef.current,
      durationMs: 2200 + Math.random() * 500,
      extraTurnsRange: [4, 6],
      pointerEl: rolePointerRef.current,
      onFrame: (rot) => {
        roleRotationRef.current = rot;
        renderRoleWheelCanvas(rot);
      },
      onComplete: (rot, chosenRole) => {
        roleRotationRef.current = rot;
        setIsRoleSpinning(false);
        if (!chosenRole) return;
        playRevealChime();
        setDrawnParty((prev) =>
          prev.map((p, idx) => (idx === targetIdx ? { ...p, assignedRole: chosenRole } : p))
        );
        showToast(`${targetName} assigned role: ${chosenRole.label}!`, "success");
      },
    });
  };

  const handleSpinCampaign = () => {
    if (isCampSpinning) return;
    if (activeCampaigns.length === 0) {
      showToast("No campaigns available on the wheel!", "warn");
      return;
    }
    setIsCampSpinning(true);
    const snapshotItems = [...activeCampaigns];

    animateWheelSpin({
      items: snapshotItems,
      startRotation: campRotationRef.current,
      durationMs: 4400 + Math.random() * 1000,
      extraTurnsRange: [5, 8],
      pointerEl: campPointerRef.current,
      onFrame: (rot) => {
        campRotationRef.current = rot;
        renderCampWheelCanvas(rot);
      },
      onComplete: (rot, winner) => {
        campRotationRef.current = rot;
        setIsCampSpinning(false);
        if (!winner) return;
        playRevealChime();
        setSelectedCampaign(winner);
        setDrawnCampaigns((prev) => [...prev, winner]);
        showToast(`Campaign Selected: ${winner.name}!`, "success");
      },
    });
  };

  const spinLimitedOnceInternal = (
    availableItems: LimitedExpansion[],
    durationMs: number
  ): Promise<LimitedExpansion | null> => {
    return new Promise((resolve) => {
      if (availableItems.length === 0) {
        resolve(null);
        return;
      }
      setIsLimSpinning(true);
      animateWheelSpin({
        items: availableItems,
        startRotation: limRotationRef.current,
        durationMs,
        extraTurnsRange: [4, 6],
        pointerEl: limPointerRef.current,
        onFrame: (rot) => {
          limRotationRef.current = rot;
          drawGenericWheel(
            limCanvasRef.current,
            limWrapperRef.current,
            availableItems,
            rot,
            (e) => e.color,
            (e) => e.name,
            "NO EXPANSIONS",
            ""
          );
        },
        onComplete: (rot, winner) => {
          limRotationRef.current = rot;
          setIsLimSpinning(false);
          if (winner) {
            playRevealChime();
            if (limMode === "shared") {
              setLimSharedPool((prev) => [...prev, winner]);
            } else {
              setLimPlayerPools((prev) =>
                prev.map((pool, idx) =>
                  idx === safeLimPlayerIdx ? [...pool, winner] : pool
                )
              );
            }
          }
          resolve(winner || null);
        },
      });
    });
  };

  const handleSpinLimitedOne = async () => {
    if (isLimSpinning || currentLimPool.length >= 3 || activeLimitedExpansions.length === 0) return;
    await spinLimitedOnceInternal(activeLimitedExpansions, 3000);
  };

  const handleDraftThreeLimited = async () => {
    if (isLimSpinning) return;
    const ownedSet = new Set(limOwnedIds);
    if (ownedSet.size < 3) {
      showToast("Enable at least 3 owned expansions to draft a full Limited Pool.", "warn");
      return;
    }

    let workingPool = [...currentLimPool];
    if (workingPool.length >= 3) {
      workingPool = [];
      if (limMode === "shared") {
        setLimSharedPool([]);
      } else {
        setLimPlayerPools((prev) =>
          prev.map((pool, idx) => (idx === safeLimPlayerIdx ? [] : pool))
        );
      }
    }

    const needed = 3 - workingPool.length;
    for (let i = 0; i < needed; i++) {
      const pickedIds = new Set(workingPool.map((e) => e.id));
      const remaining = LIMITED_EXPANSIONS.filter(
        (e) => ownedSet.has(e.id) && !pickedIds.has(e.id)
      );
      if (remaining.length === 0) break;
      const won = await spinLimitedOnceInternal(remaining, 1800);
      if (won) workingPool.push(won);
      await new Promise((r) => setTimeout(r, 320));
    }

    const targetLabel =
      limMode === "shared" ? "Shared Party" : getPlayerDisplayLabel(safeLimPlayerIdx);
    showToast(`3-Expansion Limited Pool complete for ${targetLabel}!`, "success");
  };

  /***************************************************************************
   * 10. CLIPBOARD, RESTORE POINTS, JSON BACKUP & ARKHAMDB SYNC
   ***************************************************************************/
  const copyText = (text: string, successMsg: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast(successMsg, "success"))
        .catch(() => showToast("Unable to copy to clipboard.", "warn"));
    } else {
      showToast("Clipboard unavailable in this browser.", "warn");
    }
  };

  const handleCopyFullSetup = () => {
    const lines: string[] = ["=== ARKHAM HORROR LCG — CAMPAIGN SETUP ===", ""];
    lines.push(
      `CAMPAIGN: ${selectedCampaign ? selectedCampaign.name : "(Not selected yet)"}`
    );
    lines.push("");
    lines.push(`INVESTIGATOR PARTY (${drawnParty.length}/${partySize}):`);
    if (drawnParty.length === 0) {
      lines.push("  - No investigators drafted yet.");
    } else {
      drawnParty.forEach((inv, idx) => {
        const roleTxt = inv.assignedRole ? inv.assignedRole.label : "Unassigned";
        lines.push(`  P${idx + 1}: ${inv.name} (${inv.cls} • ${inv.era}) — Role: ${roleTxt}`);
      });
    }
    lines.push("");
    lines.push("LIMITED CARD POOL (Base: Core Set + Investigator Starter Decks):");
    if (limMode === "shared") {
      const exps = limSharedPool.length
        ? limSharedPool.map((e) => `${e.name}${e.hasReturn ? " (+Return to)" : ""}`).join(", ")
        : "Not drafted yet";
      lines.push(`  Shared Party Pool: ${exps}`);
    } else {
      for (let i = 0; i < partySize; i++) {
        const pPool = limPlayerPools[i] || [];
        const exps = pPool.length
          ? pPool.map((e) => `${e.name}${e.hasReturn ? " (+Return to)" : ""}`).join(", ")
          : "Not drafted yet";
        lines.push(`  ${getPlayerDisplayLabel(i)}: ${exps}`);
      }
    }
    copyText(lines.join("\n"), "Full Campaign Setup copied to clipboard!");
  };

  const applySnapshot = (snap: RestoreSnapshot) => {
    if (snap.partySize) setPartySize(snap.partySize);
    if (typeof snap.smartRoleBalance === "boolean") setSmartRoleBalance(snap.smartRoleBalance);
    if (Array.isArray(snap.enabledEras)) {
      const valid = snap.enabledEras.filter(
        (e): e is "Chapter 1" | "Parallel" | "Chapter 2" =>
          e === "Chapter 1" || e === "Parallel" || e === "Chapter 2"
      );
      setEnabledEras(valid);
    }
    if (Array.isArray(snap.enabledClasses)) setEnabledClasses(snap.enabledClasses);
    if (typeof snap.includeSuzi === "boolean") setIncludeSuzi(snap.includeSuzi);
    if (Array.isArray(snap.customInvestigators)) {
      setCustomInvestigators(snap.customInvestigators);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_INV, JSON.stringify(snap.customInvestigators));
    }
    if (Array.isArray(snap.manuallyExcludedIds)) setManuallyExcludedIds(snap.manuallyExcludedIds);
    if (Array.isArray(snap.drawnParty)) {
      setDrawnParty(snap.drawnParty);
      setSelectedPartyIdx(snap.drawnParty.length > 0 ? snap.drawnParty.length - 1 : null);
    }
    if (typeof snap.campSplitReturn === "boolean") setCampSplitReturn(snap.campSplitReturn);
    if (typeof snap.campNoRepeat === "boolean") setCampNoRepeat(snap.campNoRepeat);
    if (Array.isArray(snap.customCampaigns)) {
      setCustomCampaigns(snap.customCampaigns);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CAMP, JSON.stringify(snap.customCampaigns));
    }
    if (Array.isArray(snap.drawnCampaigns)) setDrawnCampaigns(snap.drawnCampaigns);
    if (snap.selectedCampaign !== undefined) setSelectedCampaign(snap.selectedCampaign);
    if (snap.limMode) setLimMode(snap.limMode);
    if (Array.isArray(snap.limOwnedIds)) setLimOwnedIds(snap.limOwnedIds);
    if (Array.isArray(snap.limSharedPool)) setLimSharedPool(snap.limSharedPool);
    if (Array.isArray(snap.limPlayerPools)) setLimPlayerPools(snap.limPlayerPools);
  };

  const handleSaveRestorePoint = () => {
    const savedAt = new Date().toLocaleString();
    const snapshot: RestoreSnapshot = {
      savedAt,
      partySize,
      smartRoleBalance,
      enabledEras,
      enabledClasses,
      includeSuzi,
      customInvestigators,
      manuallyExcludedIds,
      drawnParty,
      campSplitReturn,
      campNoRepeat,
      customCampaigns,
      drawnCampaigns,
      selectedCampaign,
      limMode,
      limOwnedIds,
      limSharedPool,
      limPlayerPools,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.RESTORE, JSON.stringify(snapshot));
      setRestorePointSavedAt(savedAt);
      showToast("Full Hub Restore Point saved locally!", "success");
    } catch {
      showToast("Could not save to localStorage.", "warn");
    }
  };

  const handleLoadRestorePoint = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESTORE);
      if (!raw) {
        showToast("No Restore Point saved yet.", "info");
        return;
      }
      const snap = JSON.parse(raw) as RestoreSnapshot;
      applySnapshot(snap);
      showToast(`Restored snapshot from ${snap.savedAt || "backup"}.`, "success");
    } catch {
      showToast("Failed to load Restore Point.", "warn");
    }
  };

  const handleSyncArkhamDB = async () => {
    setIsSyncingDb(true);
    setSyncStatusMsg("Fetching public card catalog from ArkhamDB...");
    const factionMap: Record<string, InvestigatorClass> = {
      guardian: "Guardian",
      seeker: "Seeker",
      rogue: "Rogue",
      mystic: "Mystic",
      survivor: "Survivor",
      neutral: "Neutral",
    };

    try {
      const res = await fetch("https://arkhamdb.com/api/public/cards/");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const cards = (await res.json()) as Array<{
        type_code?: string;
        name?: string;
        subname?: string;
        alternate_of_code?: string;
        pack_name?: string;
        faction_code?: string;
        code?: string;
      }>;

      const existingNames = new Set(
        [...INVESTIGATORS, SUZI_INVESTIGATOR, ...customInvestigators].map((i) =>
          i.character.toLowerCase()
        )
      );
      const newlyAdded: Investigator[] = [];
      const seen = new Set<string>();

      cards.forEach((card) => {
        if (card.type_code !== "investigator" || !card.name || card.alternate_of_code) return;
        const packName = card.pack_name || "ArkhamDB Pack";
        if (packName.toLowerCase().includes("barkham")) return;
        const norm = card.name.trim().toLowerCase();
        if (existingNames.has(norm) || seen.has(norm)) return;
        seen.add(norm);
        newlyAdded.push({
          id: `adb-${card.code}`,
          character: card.name.trim(),
          name: card.name.trim(),
          subtitle: card.subname || "Investigator",
          cls: factionMap[card.faction_code || ""] || "Neutral",
          era: "Chapter 2",
          expansion: packName,
        });
      });

      if (newlyAdded.length > 0) {
        const merged = [...customInvestigators, ...newlyAdded];
        setCustomInvestigators(merged);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_INV, JSON.stringify(merged));
        setSyncStatusMsg(`Imported ${newlyAdded.length} new investigator(s) from ArkhamDB!`);
        showToast(`Imported ${newlyAdded.length} new investigator(s)!`, "success");
      } else {
        setSyncStatusMsg("Your roster is already up to date with ArkhamDB!");
        showToast("Roster is already up to date.", "info");
      }
    } catch {
      setSyncStatusMsg(
        "ArkhamDB sync unavailable right now (offline/CORS). You can still add investigators manually."
      );
      showToast("ArkhamDB sync unavailable.", "warn");
    } finally {
      setIsSyncingDb(false);
    }
  };

  const handleAddCustomInvestigator = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newInvName.trim();
    if (!trimmed) return;
    const nextInv: Investigator = {
      id: `custom-${Date.now()}`,
      character: trimmed.replace(/\s*\(.*?\)\s*/g, "").trim() || trimmed,
      name: trimmed,
      subtitle: newInvSubtitle.trim() || "Investigator",
      cls: newInvClass,
      era: newInvEra,
      expansion: newInvExpansion.trim() || "Custom Expansion",
    };
    const updated = [...customInvestigators, nextInv];
    setCustomInvestigators(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_INV, JSON.stringify(updated));
    setNewInvName("");
    setNewInvSubtitle("");
    setNewInvExpansion("");
    showToast(`Added ${nextInv.name} (${nextInv.cls}) to the wheel!`, "success");
  };

  const handleSaveCustomCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customCampName.trim();
    if (!trimmed) return;

    if (editCampId) {
      const updated = customCampaigns.map((c) =>
        c.id === editCampId ? { ...c, name: trimmed, note: customCampNote.trim() } : c
      );
      setCustomCampaigns(updated);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CAMP, JSON.stringify(updated));
      setEditCampId("");
      showToast(`Updated "${trimmed}".`, "success");
    } else {
      const updated = [
        ...customCampaigns,
        { id: `ccamp-${Date.now()}`, name: trimmed, note: customCampNote.trim() },
      ];
      setCustomCampaigns(updated);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CAMP, JSON.stringify(updated));
      showToast(`Added custom campaign "${trimmed}"!`, "success");
    }
    setCustomCampName("");
    setCustomCampNote("");
  };

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      includeSuzi,
      customInvestigators,
      customCampaigns,
      limOwnedIds,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arkham-campaign-hub-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported arkham-campaign-hub-backup.json", "success");
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        applySnapshot(JSON.parse(String(reader.result)) as RestoreSnapshot);
        showToast("Imported backup successfully!", "success");
      } catch {
        showToast("Invalid JSON backup file.", "warn");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleFactoryReset = () => {
    setCustomInvestigators([]);
    setCustomCampaigns([]);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_INV, "[]");
    localStorage.setItem(STORAGE_KEYS.CUSTOM_CAMP, "[]");
    setIncludeSuzi(false);
    setPartySize(4);
    setSmartRoleBalance(true);
    setEnabledEras(["Chapter 1", "Parallel", "Chapter 2"]);
    setEnabledClasses([...CLASS_ORDER]);
    setManuallyExcludedIds([]);
    setDrawnParty([]);
    setSelectedPartyIdx(null);
    setCampSplitReturn(false);
    setCampExcludedIds([]);
    setDrawnCampaigns([]);
    setSelectedCampaign(null);
    setLimMode("individual");
    setLimOwnedIds(LIMITED_EXPANSIONS.map((e) => e.id));
    setLimSharedPool([]);
    setLimPlayerPools([[], [], [], []]);
    showToast("Factory reset complete.", "info");
  };

  const handleResetSession = () => {
    if (isInvSpinning || isCampSpinning || isLimSpinning) return;
    setDrawnParty([]);
    setSelectedPartyIdx(null);
    setDrawnCampaigns([]);
    setSelectedCampaign(null);
    setLimSharedPool([]);
    setLimPlayerPools([[], [], [], []]);
    showToast("Session reset: party, campaign & limited pools cleared.", "info");
  };

  // Filtered roster search
  const filteredRoster = useMemo(() => {
    const q = rosterSearch.trim().toLowerCase();
    if (!q) return allInvestigators;
    return allInvestigators.filter(
      (inv) =>
        inv.name.toLowerCase().includes(q) ||
        inv.expansion.toLowerCase().includes(q) ||
        inv.cls.toLowerCase().includes(q) ||
        inv.era.toLowerCase().includes(q)
    );
  }, [allInvestigators, rosterSearch]);

  const tabLimBadgeText =
    limMode === "shared"
      ? `${limSharedPool.length}/3`
      : `${limPlayerPools.slice(0, partySize).filter((p) => p.length === 3).length}/${partySize}P`;

  /***************************************************************************
   * 11. RENDER
   ***************************************************************************/
  return (
    <div
      className="min-h-screen text-[#e7dfd0] antialiased selection:bg-amber-700/40 selection:text-amber-100"
      style={{
        backgroundColor: "#07090d",
        backgroundImage:
          "radial-gradient(circle at 20% 15%, rgba(28, 56, 52, 0.28) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(74, 35, 90, 0.22) 0%, transparent 50%), radial-gradient(circle at 50% 45%, rgba(200, 164, 93, 0.06) 0%, transparent 60%)",
      }}
    >
      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const borderCls =
            t.type === "success"
              ? "border-amber-400/70 text-amber-100"
              : t.type === "warn"
              ? "border-red-400/70 text-red-100"
              : "border-slate-500/70 text-slate-200";
          return (
            <div
              key={t.id}
              className={`pointer-events-auto px-4 py-2.5 rounded-xl bg-[#111722]/95 border ${borderCls} shadow-2xl text-xs sm:text-sm backdrop-blur-md`}
            >
              {t.message}
            </div>
          );
        })}
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Discreet Back to Games Link */}
        <div className="mb-3">
          <a
            href="/apps/juegos"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400/75 hover:text-amber-200 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Games Hub</span>
          </a>
        </div>

        {/* Header */}
        <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl ${PANEL_CLS} flex items-center justify-center shrink-0 border-amber-500/40`}>
              <svg viewBox="0 0 64 64" className="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="32" cy="32" r="27" strokeOpacity="0.45" />
                <polygon
                  points="32,7 39,26 57,26 42,37 48,55 32,44 16,55 22,37 7,26 25,26"
                  strokeLinejoin="round"
                  fill="rgba(200,164,93,0.12)"
                />
                <circle cx="32" cy="32" r="5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-amber-400/80 font-semibold">
                Arkham Horror: The Card Game
              </p>
              <h1 className={`${cinzel.className} text-2xl sm:text-3xl font-bold tracking-wide text-amber-100 leading-tight`}>
                Campaign Wheel Hub
              </h1>
            </div>
          </div>

          {/* Top Right Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyFullSetup}
              className="px-3.5 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/70 border border-amber-400/60 transition flex items-center gap-2 text-xs sm:text-sm text-amber-100 font-medium cursor-pointer shadow-lg"
            >
              <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Full Setup</span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`px-3 py-2 rounded-xl ${PANEL_CLS} hover:border-amber-400/60 transition flex items-center gap-2 text-xs sm:text-sm text-amber-100 cursor-pointer`}
            >
              {soundEnabled ? (
                <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M23 9l-6 6M17 9l6 6" />
                </svg>
              )}
              <span className="hidden sm:inline">{soundEnabled ? "Sound On" : "Muted"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(true)}
              className={`px-3 py-2 rounded-xl ${PANEL_CLS} hover:border-amber-400/60 transition flex items-center gap-2 text-xs sm:text-sm text-amber-200 cursor-pointer`}
            >
              <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Update / Backup</span>
            </button>

            <button
              type="button"
              onClick={handleResetSession}
              className={`px-3 py-2 rounded-xl ${PANEL_CLS} hover:border-red-400/60 hover:text-red-200 transition flex items-center gap-2 text-xs sm:text-sm text-slate-300 cursor-pointer`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Reset Session</span>
            </button>
          </div>
        </header>

        {/* Main 3-Tab Navigation */}
        <nav className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5" role="tablist">
          {[
            {
              key: "investigators" as TabKey,
              num: "I",
              title: "Investigators & Roles",
              sub: "Balanced Party Draft",
              badge: String(activeInvestigators.length),
              accentBg: "bg-amber-500/15 border-amber-400/30 text-amber-300",
              badgeColor: "text-amber-300",
            },
            {
              key: "campaigns" as TabKey,
              num: "II",
              title: "Campaigns Wheel",
              sub: "Full Campaigns & Custom",
              badge: String(activeCampaigns.length),
              accentBg: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300",
              badgeColor: "text-emerald-300",
            },
            {
              key: "limited" as TabKey,
              num: "III",
              title: "Limited Pool Wheel",
              sub: "3-Expansion Card Pool",
              badge: tabLimBadgeText,
              accentBg: "bg-purple-500/15 border-purple-400/30 text-purple-300",
              badgeColor: "text-purple-300",
            },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl px-4 py-3 flex items-center justify-between border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[linear-gradient(180deg,rgba(200,164,93,0.24)_0%,rgba(138,112,66,0.14)_100%)] border-[#ebd29b]/70 text-[#fff3d6] shadow-[0_4px_18px_rgba(200,164,93,0.18),inset_0_1px_0_rgba(255,243,214,0.25)]"
                    : "bg-[#0e131c]/80 border-[#c8a45d]/20 text-[#9ba3b4] hover:border-[#c8a45d]/50 hover:text-[#ebd29b]"
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <span
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center ${cinzel.className} font-bold text-xs ${tab.accentBg}`}
                  >
                    {tab.num}
                  </span>
                  <div>
                    <div className={`${cinzel.className} text-xs sm:text-sm font-bold tracking-wider uppercase`}>
                      {tab.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{tab.sub}</div>
                  </div>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-md bg-black/40 ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Gold Divider */}
        <div
          className="h-px mb-6"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(200, 164, 93, 0.45), transparent)",
          }}
        />

        {/* =================================================================== */}
        {/* TAB 1: INVESTIGATORS & BALANCED ROLES                               */}
        {/* =================================================================== */}
        {activeTab === "investigators" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Party Size, Balance, Era & Class Filters */}
            <section className="lg:col-span-3 space-y-5 order-2 lg:order-1">
              {/* Party & Balance */}
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5 space-y-3.5`}>
                <div className="flex items-center justify-between">
                  <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                    Party &amp; Balance
                  </h2>
                  <span className="text-[11px] font-mono text-amber-200/80">
                    {activeInvestigators.length}/{allInvestigators.length}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-2">Target Party Size</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[2, 3, 4].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setPartySize(sz)}
                        className={`py-2 rounded-xl border text-xs ${cinzel.className} font-bold transition cursor-pointer ${
                          partySize === sz
                            ? "bg-amber-950/50 border-amber-400/70 text-amber-100"
                            : "bg-[#0b0e14]/80 border-slate-800 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {sz} Players
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <ToggleSwitch
                    checked={smartRoleBalance}
                    onChange={setSmartRoleBalance}
                    title="Smart Role Balance"
                    description="Caps Support (max 1), Cluever/Fighter, & guarantees Clue + Enemy coverage."
                  />
                </div>
              </div>

              {/* Era & Version Filters + Suzi */}
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                    Era &amp; Version
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      if (isInvSpinning) return;
                      setEnabledEras((prev) =>
                        prev.length === ERA_ORDER.length ? [] : [...ERA_ORDER]
                      );
                    }}
                    className="text-[11px] text-amber-400/80 hover:text-amber-200 underline underline-offset-2 cursor-pointer"
                  >
                    All
                  </button>
                </div>

                <div className="space-y-2">
                  {ERA_ORDER.map((eraKey) => {
                    const info = ERA_META[eraKey];
                    const isChecked = enabledEras.includes(eraKey);
                    const totalInEra = allInvestigators.filter((i) => i.era === eraKey).length;
                    const activeInEra = activeInvestigators.filter((i) => i.era === eraKey).length;
                    return (
                      <button
                        key={eraKey}
                        type="button"
                        onClick={() => {
                          if (isInvSpinning) return;
                          setEnabledEras((prev) =>
                            prev.includes(eraKey)
                              ? prev.filter((e) => e !== eraKey)
                              : [...prev, eraKey]
                          );
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition cursor-pointer ${
                          isChecked
                            ? "bg-amber-950/35 border-amber-400/50 text-amber-50"
                            : "bg-[#0b0e14]/70 border-slate-800 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                              isChecked
                                ? "bg-amber-400 border-amber-300 text-slate-950"
                                : "border-slate-600"
                            }`}
                          >
                            {isChecked && (
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-semibold leading-tight">{info.label}</div>
                            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{info.desc}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-mono ${isChecked ? "text-amber-300" : "text-slate-600"}`}>
                          {activeInEra}/{totalInEra}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bonus Investigator: Suzi */}
                <div className="mt-3 pt-3 border-t border-amber-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      if (isInvSpinning) return;
                      const next = !includeSuzi;
                      setIncludeSuzi(next);
                      showToast(
                        next
                          ? 'Subject 5U-21 ("Suzi") added!'
                          : 'Subject 5U-21 ("Suzi") removed.',
                        "info"
                      );
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition cursor-pointer ${
                      includeSuzi
                        ? "bg-purple-950/35 border-purple-400/60 text-amber-50"
                        : "bg-[#0b0e14]/70 border-slate-800 text-slate-400 hover:border-purple-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          includeSuzi
                            ? "bg-purple-400 border-purple-300 text-slate-950"
                            : "border-slate-600"
                        }`}
                      >
                        {includeSuzi && (
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold leading-tight flex items-center gap-1.5">
                          <span>Subject 5U-21 (&quot;Suzi&quot;)</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                            Bonus
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                          The Blob That Ate Everything Else!
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase ${
                        includeSuzi ? "text-purple-300 font-bold" : "text-slate-500"
                      }`}
                    >
                      {includeSuzi ? "ON" : "OFF"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Class Filters */}
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                    Investigator Class
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      if (isInvSpinning) return;
                      setEnabledClasses((prev) =>
                        prev.length === CLASS_ORDER.length ? [] : [...CLASS_ORDER]
                      );
                    }}
                    className="text-[11px] text-amber-400/80 hover:text-amber-200 underline underline-offset-2 cursor-pointer"
                  >
                    All
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {CLASS_ORDER.map((clsKey) => {
                    const meta = CLASS_META[clsKey];
                    const isChecked = enabledClasses.includes(clsKey);
                    const totalInCls = allInvestigators.filter((i) => i.cls === clsKey).length;
                    const activeInCls = activeInvestigators.filter((i) => i.cls === clsKey).length;
                    return (
                      <button
                        key={clsKey}
                        type="button"
                        onClick={() => {
                          if (isInvSpinning) return;
                          setEnabledClasses((prev) =>
                            prev.includes(clsKey)
                              ? prev.filter((c) => c !== clsKey)
                              : [...prev, clsKey]
                          );
                        }}
                        style={
                          isChecked
                            ? {
                                borderColor: meta.badgeBorder,
                                boxShadow: `inset 3px 0 0 ${meta.color}`,
                              }
                            : undefined
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition cursor-pointer ${
                          isChecked
                            ? "bg-slate-900/80 text-amber-50"
                            : "bg-[#0b0e14]/70 border-slate-800 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: meta.color, opacity: isChecked ? 1 : 0.35 }}
                          />
                          <span className="text-xs sm:text-sm font-medium">{clsKey}</span>
                        </div>
                        <span className={`text-xs font-mono ${isChecked ? "text-slate-300" : "text-slate-600"}`}>
                          {activeInCls}/{totalInCls}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Party Draft Rules */}
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5 space-y-3.5`}>
                <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                  Party Draft Rules
                </h2>
                <ToggleSwitch
                  checked={ruleNoRepeat}
                  onChange={setRuleNoRepeat}
                  disabled={isInvSpinning}
                  title="No Repeat Investigators"
                  description="Remove the selected investigator after each spin."
                />
                <ToggleSwitch
                  checked={ruleUniqueCharacter}
                  onChange={setRuleUniqueCharacter}
                  disabled={isInvSpinning}
                  title="Unique Character"
                  description="Exclude Parallel / Ch. 1 / Ch. 2 versions of the same character."
                />
                <ToggleSwitch
                  checked={ruleUniqueClass}
                  onChange={setRuleUniqueClass}
                  disabled={isInvSpinning}
                  title="Unique Class per Party"
                  description="Remove the entire class after a spin."
                />
              </div>
            </section>

            {/* CENTER COLUMN: Investigator Wheel + Spotlight & Role Mini-Wheel */}
            <section className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
              <div
                className="w-full max-w-[560px] aspect-square mx-auto flex items-center justify-center relative my-1"
                style={{ filter: "drop-shadow(0 0 36px rgba(0, 0, 0, 0.85))" }}
              >
                <div
                  className="absolute -inset-3 rounded-full pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(200, 164, 93, 0.16) 0%, rgba(30, 82, 74, 0.1) 50%, transparent 72%)",
                  }}
                />

                {/* Top Pointer */}
                <div
                  ref={invPointerRef}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 z-20 pointer-events-none origin-top transition-transform duration-75"
                >
                  <svg width="38" height="46" viewBox="0 0 38 46" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                    <path d="M19 44L4 12C2.5 8.5 5 4 9 4H29C33 4 35.5 8.5 34 12L19 44Z" fill="url(#pGold1)" stroke="#fff2cc" strokeWidth="1.8" />
                    <circle cx="19" cy="14" r="4" fill="#10151e" stroke="#f5dca0" strokeWidth="1.5" />
                    <defs>
                      <linearGradient id="pGold1" x1="19" y1="4" x2="19" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f7e2ab" />
                        <stop offset="1" stopColor="#9b732d" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div ref={invWrapperRef} className="w-full h-full relative z-10 p-2 sm:p-3">
                  <canvas
                    ref={invCanvasRef}
                    onClick={handleSpinInvestigator}
                    className="w-full h-full block cursor-pointer rounded-full"
                  />
                </div>

                <button
                  type="button"
                  disabled={isInvSpinning || activeInvestigators.length === 0}
                  onClick={handleSpinInvestigator}
                  aria-label="Spin Investigator Wheel"
                  className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-2 border-amber-300/90 bg-gradient-to-b from-[#1e2636] to-[#0a0d13] shadow-[0_0_25px_rgba(0,0,0,0.95)] hover:enabled:scale-105 active:enabled:scale-95 disabled:opacity-50 transition cursor-pointer group"
                >
                  <svg viewBox="0 0 64 64" className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 group-hover:text-amber-200 transition" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <polygon points="32,8 39,26 56,26 42,37 47,54 32,43 17,54 22,37 8,26 25,26" strokeLinejoin="round" fill="rgba(200,164,93,0.18)" />
                  </svg>
                  <span className={`${cinzel.className} text-[9px] sm:text-[10px] tracking-[0.2em] text-amber-200 font-bold -mt-0.5`}>
                    SPIN
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-[540px] flex flex-wrap items-center justify-center gap-3 mt-4">
                <button
                  type="button"
                  disabled={isInvSpinning || activeInvestigators.length === 0}
                  onClick={handleSpinInvestigator}
                  className={`${SPIN_BTN_CLS} ${cinzel.className} font-bold uppercase tracking-[0.18em] text-sm sm:text-base px-8 py-3.5 rounded-xl flex items-center gap-2.5 cursor-pointer flex-1 sm:flex-none justify-center min-w-[220px]`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" />
                  </svg>
                  <span>Spin Investigator</span>
                </button>

                <button
                  type="button"
                  disabled={isInvSpinning || activeInvestigators.length <= 1}
                  onClick={() => {
                    const arr = orderedInvestigators.map((i) => i.id);
                    for (let i = arr.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [arr[i], arr[j]] = [arr[j], arr[i]];
                    }
                    setInvOrder(arr);
                    showToast("Investigator wheel shuffled.", "info");
                  }}
                  className={`px-5 py-3.5 rounded-xl ${PANEL_CLS} hover:border-amber-400/60 text-amber-100 text-sm font-medium flex items-center gap-2 transition cursor-pointer disabled:opacity-45`}
                >
                  <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                  </svg>
                  <span>Shuffle</span>
                </button>
              </div>

              {/* Result Spotlight + Mini Role Wheel */}
              <div className={`w-full max-w-[560px] mt-5 ${PANEL_CLS} rounded-2xl p-5 border-amber-400/35`}>
                {!focusedInvestigator ? (
                  <div className="text-center py-3">
                    <div className={`${cinzel.className} text-sm uppercase tracking-[0.2em] text-amber-400/75 mb-1`}>
                      Awaiting the Mythos
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">
                      Spin the wheel to summon an investigator, then spin their balanced role.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-lg"
                          style={{
                            backgroundColor: CLASS_META[focusedInvestigator.cls].badgeBg,
                            borderColor: CLASS_META[focusedInvestigator.cls].badgeBorder,
                            color: CLASS_META[focusedInvestigator.cls].badgeText,
                          }}
                        >
                          <ClassIcon cls={focusedInvestigator.cls} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: CLASS_META[focusedInvestigator.cls].badgeBg,
                                borderColor: CLASS_META[focusedInvestigator.cls].badgeBorder,
                                color: CLASS_META[focusedInvestigator.cls].badgeText,
                              }}
                            >
                              {focusedInvestigator.cls}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-950/70 text-amber-200 border border-amber-500/30">
                              {focusedInvestigator.era}
                            </span>
                          </div>
                          <h3 className={`${cinzel.className} text-xl sm:text-2xl font-bold text-amber-50 leading-tight`}>
                            {focusedInvestigator.name}
                          </h3>
                          <div className="text-xs sm:text-sm text-amber-200/80 italic">
                            &ldquo;{focusedInvestigator.subtitle}&rdquo;
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Expansion: {focusedInvestigator.expansion}
                          </div>
                        </div>
                      </div>

                      {focusedInvestigator.assignedRole && (
                        <div
                          className={`sm:self-start px-3 py-1.5 rounded-xl border text-xs ${cinzel.className} font-bold uppercase tracking-wider shrink-0`}
                          style={{
                            backgroundColor: focusedInvestigator.assignedRole.badgeBg,
                            borderColor: focusedInvestigator.assignedRole.badgeBorder,
                            color: focusedInvestigator.assignedRole.badgeText,
                          }}
                        >
                          Role: {focusedInvestigator.assignedRole.label}
                        </div>
                      )}
                    </div>

                    {/* Mini Role Wheel */}
                    <div className="mt-5 pt-4 border-t border-amber-500/20">
                      <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="relative w-[156px] h-[156px] shrink-0 flex items-center justify-center">
                          <div
                            ref={rolePointerRef}
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20 pointer-events-none origin-top transition-transform duration-75"
                          >
                            <svg width="20" height="24" viewBox="0 0 38 46" fill="none">
                              <path d="M19 44L4 12C2.5 8.5 5 4 9 4H29C33 4 35.5 8.5 34 12L19 44Z" fill="#ebd29b" stroke="#10151e" strokeWidth="2.5" />
                            </svg>
                          </div>
                          <canvas
                            ref={roleCanvasRef}
                            width={156}
                            height={156}
                            onClick={handleSpinRole}
                            className="w-full h-full rounded-full cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.75)]"
                          />
                          <button
                            type="button"
                            disabled={isRoleSpinning}
                            onClick={handleSpinRole}
                            aria-label="Spin Role Wheel"
                            className={`absolute z-10 w-9 h-9 rounded-full bg-[#121824] border border-amber-300/80 text-[8px] ${cinzel.className} font-bold text-amber-200 tracking-wider hover:enabled:scale-105 active:enabled:scale-95 transition cursor-pointer shadow-lg`}
                          >
                            ROLE
                          </button>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span className={`${cinzel.className} text-xs uppercase tracking-[0.2em] text-amber-400/90 font-semibold`}>
                              Assign Investigator Role
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                smartRoleBalance
                                  ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/35"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              {smartRoleBalance ? "Smart Balance ON" : "Smart Balance OFF"}
                            </span>
                          </div>

                          <div className="text-xs sm:text-sm text-slate-300 mt-1.5">
                            {focusedInvestigator.assignedRole ? (
                              <>
                                Assigned Role:{" "}
                                <strong style={{ color: focusedInvestigator.assignedRole.badgeText }}>
                                  {focusedInvestigator.assignedRole.label}
                                </strong>{" "}
                                — <span>{focusedInvestigator.assignedRole.desc}</span>
                              </>
                            ) : (
                              <>
                                Available roles:{" "}
                                {allowedRolesInfo.roles.map((r, i) => (
                                  <React.Fragment key={r.key}>
                                    {i > 0 && ", "}
                                    <span className="font-medium" style={{ color: r.badgeText }}>
                                      {r.label}
                                    </span>
                                  </React.Fragment>
                                ))}
                                .
                              </>
                            )}
                          </div>

                          {allowedRolesInfo.note && (
                            <div className="text-[11px] text-amber-300/80 mt-1">
                              Balance filter: {allowedRolesInfo.note}
                            </div>
                          )}

                          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <button
                              type="button"
                              disabled={isRoleSpinning}
                              onClick={handleSpinRole}
                              className={`${SPIN_BTN_CLS} ${cinzel.className} font-bold uppercase tracking-[0.14em] text-xs px-4 py-2 rounded-lg cursor-pointer`}
                            >
                              Spin Role
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT COLUMN: Drafted Party & Roster Explorer */}
            <section className="lg:col-span-3 space-y-5 order-3">
              {/* Drafted Party */}
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                      Drafted Party
                    </h2>
                    <div className="text-[11px] text-slate-400">
                      Drafted: {drawnParty.length} / {partySize} (click to edit role)
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (drawnParty.length === 0) {
                          showToast("Draft at least one investigator first.", "info");
                          return;
                        }
                        const lines = drawnParty.map(
                          (inv, idx) =>
                            `Player ${idx + 1}: ${inv.name} (${inv.cls} — ${inv.expansion}${
                              inv.assignedRole ? ` | Role: ${inv.assignedRole.label}` : ""
                            })`
                        );
                        copyText(`Arkham Horror LCG Party:\n${lines.join("\n")}`, "Drafted party copied!");
                      }}
                      className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-200 border border-amber-500/25 transition cursor-pointer"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (isInvSpinning) return;
                        setDrawnParty([]);
                        setSelectedPartyIdx(null);
                        showToast("Drafted party cleared.", "info");
                      }}
                      className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-red-950/80 text-slate-300 hover:text-red-200 border border-slate-700 transition cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {drawnParty.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-4 text-center">
                      No investigators drafted yet.
                    </div>
                  ) : (
                    drawnParty.map((inv, idx) => {
                      const meta = CLASS_META[inv.cls];
                      const isFocused = focusedInvestigator === inv;
                      return (
                        <div
                          key={`${inv.id}-${idx}`}
                          onClick={() => setSelectedPartyIdx(idx)}
                          style={{ borderLeft: `3px solid ${meta.color}` }}
                          className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border transition cursor-pointer ${
                            isFocused
                              ? "bg-amber-950/30 border-amber-400/50"
                              : "bg-[#0b0f16] border-slate-800/90 hover:border-slate-600"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-amber-400/80">P{idx + 1}</span>
                              <span className="text-xs sm:text-sm font-semibold text-amber-50 truncate">
                                {inv.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-400 truncate">{inv.cls}</span>
                              {inv.assignedRole ? (
                                <span
                                  className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border"
                                  style={{
                                    backgroundColor: inv.assignedRole.badgeBg,
                                    color: inv.assignedRole.badgeText,
                                    borderColor: inv.assignedRole.badgeBorder,
                                  }}
                                >
                                  {inv.assignedRole.label}
                                </span>
                              ) : (
                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                  No Role
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isInvSpinning) return;
                              setDrawnParty((prev) => prev.filter((_, i) => i !== idx));
                              setSelectedPartyIdx(null);
                              showToast(`Restored ${inv.name} to the pool.`, "info");
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-300 hover:bg-red-950/50 transition cursor-pointer shrink-0"
                            title="Remove from party"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Roster Manager */}
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                    Roster Manager
                  </h2>
                  <span className="text-[11px] text-slate-400">{filteredRoster.length} shown</span>
                </div>
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  placeholder="Search name or expansion..."
                  className="w-full mb-3 bg-[#090c11] border border-amber-500/25 focus:border-amber-400/70 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-amber-50 placeholder-slate-500 outline-none transition"
                />
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {filteredRoster.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-4 text-center">
                      No matching investigators.
                    </div>
                  ) : (
                    filteredRoster.map((inv) => {
                      const meta = CLASS_META[inv.cls];
                      const eraOn =
                        inv.era === "Bonus" ? includeSuzi : enabledEras.includes(inv.era);
                      const clsOn = enabledClasses.includes(inv.cls);
                      const partyBlocked = isExcludedByPartyRules(inv);
                      const manualOff = manuallyExcludedIds.includes(inv.id);
                      const isActive = eraOn && clsOn && !partyBlocked && !manualOff;

                      return (
                        <button
                          key={inv.id}
                          type="button"
                          onClick={() => {
                            if (isInvSpinning) return;
                            if (partyBlocked) {
                              showToast("Remove this investigator from Drafted Party first.", "info");
                              return;
                            }
                            if (!eraOn || !clsOn) {
                              showToast(`Enable ${inv.era} & ${inv.cls} filters first.`, "info");
                              return;
                            }
                            setManuallyExcludedIds((prev) =>
                              prev.includes(inv.id)
                                ? prev.filter((x) => x !== inv.id)
                                : [...prev, inv.id]
                            );
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer border ${
                            isActive
                              ? "bg-[#0d121b] border-slate-800/80 hover:border-amber-500/40 text-amber-50"
                              : "bg-[#080a0f] border-transparent text-slate-500 opacity-65 hover:opacity-90"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: meta.color }}
                            />
                            <div className="min-w-0">
                              <div className={`text-xs font-medium truncate ${!isActive ? "line-through" : ""}`}>
                                {inv.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {inv.expansion}
                              </div>
                            </div>
                          </div>
                          {partyBlocked ? (
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 shrink-0">
                              Drafted
                            </span>
                          ) : !eraOn || !clsOn ? (
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                              Filtered
                            </span>
                          ) : null}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: CAMPAIGNS WHEEL                                              */}
        {/* =================================================================== */}
        {activeTab === "campaigns" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Rules & Custom Campaigns */}
            <section className="lg:col-span-3 space-y-5 order-2 lg:order-1">
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5 space-y-3.5`}>
                <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                  Campaign Rules
                </h2>
                <ToggleSwitch
                  checked={campSplitReturn}
                  onChange={(next) => {
                    setCampSplitReturn(next);
                    showToast(
                      next
                        ? "Standard & Return To campaigns separated on wheel."
                        : "Default mode: Return To editions enabled where available.",
                      "info"
                    );
                  }}
                  disabled={isCampSpinning}
                  title='Separate "Return to..."'
                  description="OFF (default): uses Return To editions when available. ON: puts both Standard & Return To on the wheel."
                />
                <ToggleSwitch
                  checked={campNoRepeat}
                  onChange={setCampNoRepeat}
                  disabled={isCampSpinning}
                  title="No Repeat Campaigns"
                  description="Exclude drawn campaigns from subsequent spins this session."
                />
              </div>

              {/* Add / Edit Custom Campaign */}
              <form
                onSubmit={handleSaveCustomCampaign}
                className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5 space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                    {editCampId ? "Edit Custom Campaign" : "Add Custom Campaign"}
                  </h2>
                  {editCampId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditCampId("");
                        setCustomCampName("");
                        setCustomCampNote("");
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-200 underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={customCampName}
                  onChange={(e) => setCustomCampName(e.target.value)}
                  placeholder="Campaign Name (e.g. Dark Matter)"
                  className="w-full bg-[#090c11] border border-amber-500/25 focus:border-amber-400/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-amber-50 placeholder-slate-500 outline-none"
                />
                <input
                  type="text"
                  value={customCampNote}
                  onChange={(e) => setCustomCampNote(e.target.value)}
                  placeholder="Note / Scenarios (e.g. 8 Scenarios • Fan-made)"
                  className="w-full bg-[#090c11] border border-amber-500/25 focus:border-amber-400/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-amber-50 placeholder-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/50 text-amber-100 text-xs ${cinzel.className} font-bold uppercase tracking-wider transition cursor-pointer`}
                >
                  {editCampId ? "Save Changes" : "Add Custom Campaign"}
                </button>
              </form>

              {/* Custom Campaigns List */}
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-2.5">
                  <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                    Custom Campaigns
                  </h2>
                  <span className="text-[11px] text-slate-400">{customCampaigns.length}</span>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {customCampaigns.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-2 text-center">
                      No custom campaigns added yet.
                    </div>
                  ) : (
                    customCampaigns.map((cc) => (
                      <div
                        key={cc.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#0b0f16] border border-slate-800"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-amber-100 truncate">{cc.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {cc.note || "Custom Campaign"}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditCampId(cc.id);
                              setCustomCampName(cc.name);
                              setCustomCampNote(cc.note || "");
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-200 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const next = customCampaigns.filter((x) => x.id !== cc.id);
                              setCustomCampaigns(next);
                              localStorage.setItem(STORAGE_KEYS.CUSTOM_CAMP, JSON.stringify(next));
                              if (selectedCampaign?.id === cc.id) setSelectedCampaign(null);
                              showToast(`Deleted custom campaign "${cc.name}".`, "info");
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-red-950/80 text-[10px] text-red-300 cursor-pointer"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* CENTER COLUMN: Campaign Wheel */}
            <section className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
              <div
                className="w-full max-w-[540px] aspect-square mx-auto flex items-center justify-center relative my-1"
                style={{ filter: "drop-shadow(0 0 36px rgba(0, 0, 0, 0.85))" }}
              >
                <div
                  className="absolute -inset-3 rounded-full pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(200, 164, 93, 0.16) 0%, rgba(30, 82, 74, 0.1) 50%, transparent 72%)",
                  }}
                />

                <div
                  ref={campPointerRef}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 z-20 pointer-events-none origin-top transition-transform duration-75"
                >
                  <svg width="38" height="46" viewBox="0 0 38 46" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                    <path d="M19 44L4 12C2.5 8.5 5 4 9 4H29C33 4 35.5 8.5 34 12L19 44Z" fill="url(#pGold2)" stroke="#fff2cc" strokeWidth="1.8" />
                    <circle cx="19" cy="14" r="4" fill="#10151e" stroke="#f5dca0" strokeWidth="1.5" />
                    <defs>
                      <linearGradient id="pGold2" x1="19" y1="4" x2="19" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f7e2ab" />
                        <stop offset="1" stopColor="#9b732d" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div ref={campWrapperRef} className="w-full h-full relative z-10 p-2 sm:p-3">
                  <canvas
                    ref={campCanvasRef}
                    onClick={handleSpinCampaign}
                    className="w-full h-full block cursor-pointer rounded-full"
                  />
                </div>

                <button
                  type="button"
                  disabled={isCampSpinning || activeCampaigns.length === 0}
                  onClick={handleSpinCampaign}
                  aria-label="Spin Campaign Wheel"
                  className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-2 border-amber-300/90 bg-gradient-to-b from-[#1e2636] to-[#0a0d13] shadow-[0_0_25px_rgba(0,0,0,0.95)] hover:enabled:scale-105 active:enabled:scale-95 disabled:opacity-50 transition cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className={`${cinzel.className} text-[9px] tracking-[0.2em] text-amber-200 font-bold`}>
                    SPIN
                  </span>
                </button>
              </div>

              <div className="w-full max-w-[520px] flex flex-wrap items-center justify-center gap-3 mt-4">
                <button
                  type="button"
                  disabled={isCampSpinning || activeCampaigns.length === 0}
                  onClick={handleSpinCampaign}
                  className={`${SPIN_BTN_CLS} ${cinzel.className} font-bold uppercase tracking-[0.18em] text-sm sm:text-base px-8 py-3.5 rounded-xl flex items-center gap-2.5 cursor-pointer flex-1 sm:flex-none justify-center min-w-[220px]`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" />
                  </svg>
                  <span>Spin Campaign</span>
                </button>

                <button
                  type="button"
                  disabled={isCampSpinning || activeCampaigns.length <= 1}
                  onClick={() => {
                    const arr = orderedCampaigns.map((c) => c.id);
                    for (let i = arr.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [arr[i], arr[j]] = [arr[j], arr[i]];
                    }
                    setCampOrder(arr);
                    showToast("Campaign wheel shuffled.", "info");
                  }}
                  className={`px-5 py-3.5 rounded-xl ${PANEL_CLS} hover:border-amber-400/60 text-amber-100 text-sm font-medium flex items-center gap-2 transition cursor-pointer disabled:opacity-45`}
                >
                  <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                  </svg>
                  <span>Shuffle</span>
                </button>
              </div>

              {/* Campaign Spotlight */}
              <div className={`w-full max-w-[540px] mt-5 ${PANEL_CLS} rounded-2xl p-5 border-amber-400/35`}>
                {!selectedCampaign ? (
                  <div className="text-center py-3">
                    <div className={`${cinzel.className} text-sm uppercase tracking-[0.2em] text-amber-400/75 mb-1`}>
                      No Campaign Chosen
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">
                      Spin to choose your next full-length Arkham Horror campaign.
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      {selectedCampaign.tag}
                    </span>
                    <h3 className={`${cinzel.className} text-xl sm:text-2xl font-bold text-amber-50 mt-1.5`}>
                      {selectedCampaign.name}
                    </h3>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1">
                      {selectedCampaign.note}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT COLUMN: Drawn Campaigns & Pool */}
            <section className="lg:col-span-3 space-y-5 order-3">
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                      Session History
                    </h2>
                    <div className="text-[11px] text-slate-400">
                      Drawn campaigns ({drawnCampaigns.length})
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawnCampaigns([]);
                      setSelectedCampaign(null);
                      showToast("Campaign session history cleared.", "info");
                    }}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-red-950/80 text-slate-300 hover:text-red-200 border border-slate-700 transition cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {drawnCampaigns.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-3 text-center">
                      No campaigns drawn yet.
                    </div>
                  ) : (
                    drawnCampaigns.map((c, idx) => (
                      <div
                        key={`${c.id}-${idx}`}
                        style={{ borderLeft: `3px solid ${c.color}` }}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#0b0f16] border border-slate-800"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-amber-50 truncate">
                            {idx + 1}. {c.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{c.tag}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = drawnCampaigns.filter((_, i) => i !== idx);
                            setDrawnCampaigns(next);
                            if (selectedCampaign === c) {
                              setSelectedCampaign(next[next.length - 1] || null);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-red-300 cursor-pointer"
                          title="Remove"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                    Campaign Pool
                  </h2>
                  <span className="text-[11px] text-slate-400">{activeCampaigns.length} active</span>
                </div>
                <div className="text-[11px] text-slate-400 mb-3">
                  Click any campaign to exclude or include it on the wheel.
                </div>
                <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                  {allCampaignEntries.map((c) => {
                    const isDrawn = campNoRepeat && drawnCampaigns.some((d) => d.id === c.id);
                    const isExcl = campExcludedIds.includes(c.id);
                    const isActive = !isDrawn && !isExcl;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          if (isCampSpinning) return;
                          if (isDrawn) {
                            showToast("Clear Session History to restore drawn campaigns.", "info");
                            return;
                          }
                          setCampExcludedIds((prev) =>
                            prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                          );
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition cursor-pointer border ${
                          isActive
                            ? "bg-[#0d121b] border-slate-800 hover:border-amber-500/40 text-amber-50"
                            : "bg-[#080a0f] border-transparent text-slate-500 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: c.color }}
                          />
                          <span className={`text-xs font-medium truncate ${!isActive ? "line-through" : ""}`}>
                            {c.name}
                          </span>
                        </div>
                        {isDrawn && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 shrink-0">
                            Drawn
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: LIMITED POOL WHEEL (3-EXPANSION DRAFT)                       */}
        {/* =================================================================== */}
        {activeTab === "limited" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Mode & Owned Collection */}
            <section className="lg:col-span-3 space-y-5 order-2 lg:order-1">
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5 space-y-3.5`}>
                <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                  Limited Pool Mode
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isLimSpinning}
                    onClick={() => setLimMode("individual")}
                    className={`py-2.5 px-2 rounded-xl border text-xs ${cinzel.className} font-bold transition cursor-pointer ${
                      limMode === "individual"
                        ? "bg-amber-950/50 border-amber-400/70 text-amber-100"
                        : "bg-[#0b0e14]/80 border-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    Per Investigator
                  </button>
                  <button
                    type="button"
                    disabled={isLimSpinning}
                    onClick={() => setLimMode("shared")}
                    className={`py-2.5 px-2 rounded-xl border text-xs ${cinzel.className} font-bold transition cursor-pointer ${
                      limMode === "shared"
                        ? "bg-amber-950/50 border-amber-400/70 text-amber-100"
                        : "bg-[#0b0e14]/80 border-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    Shared Party
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#0a0e15] border border-amber-500/20 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-amber-200">Always Included (Base Pool):</div>
                  <div className="text-[11px] text-slate-400">• Core Set + Investigator Starter Decks</div>
                  <div className="text-[11px] text-slate-400">
                    • Any drafted cycle automatically includes its{" "}
                    <span className="text-amber-300">Return to...</span> player cards.
                  </div>
                </div>
              </div>

              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                    Owned Collection
                  </h2>
                  <button
                    type="button"
                    disabled={isLimSpinning}
                    onClick={() =>
                      setLimOwnedIds((prev) =>
                        prev.length === LIMITED_EXPANSIONS.length
                          ? []
                          : LIMITED_EXPANSIONS.map((e) => e.id)
                      )
                    }
                    className="text-[11px] text-amber-400/80 hover:text-amber-200 underline cursor-pointer"
                  >
                    All
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 mb-3">
                  Uncheck expansions you don&apos;t physically own.
                </div>
                <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                  {LIMITED_EXPANSIONS.map((exp) => {
                    const owned = limOwnedIds.includes(exp.id);
                    return (
                      <button
                        key={exp.id}
                        type="button"
                        disabled={isLimSpinning}
                        onClick={() =>
                          setLimOwnedIds((prev) =>
                            prev.includes(exp.id)
                              ? prev.filter((x) => x !== exp.id)
                              : [...prev, exp.id]
                          )
                        }
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition cursor-pointer border ${
                          owned
                            ? "bg-[#0d121b] border-slate-800 hover:border-amber-500/40 text-amber-50"
                            : "bg-[#080a0f] border-transparent text-slate-500 opacity-55"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: exp.color }}
                          />
                          <span className={`text-xs font-medium truncate ${!owned ? "line-through" : ""}`}>
                            {exp.name}
                          </span>
                        </div>
                        {exp.hasReturn && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 shrink-0">
                            +Return
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* CENTER COLUMN: Limited Wheel */}
            <section className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
              {limMode === "individual" && (
                <div className="w-full max-w-[540px] mb-3 flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: partySize }).map((_, idx) => {
                    const pPool = limPlayerPools[idx] || [];
                    const isSelected = idx === safeLimPlayerIdx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isLimSpinning}
                        onClick={() => setLimActivePlayerIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-amber-950/60 border-amber-400/70 text-amber-100"
                            : "bg-[#0c1018] border-slate-800 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <span className="truncate max-w-[130px]">{getPlayerDisplayLabel(idx)}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 rounded ${
                            pPool.length === 3
                              ? "bg-emerald-950 text-emerald-300"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {pPool.length}/3
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div
                className="w-full max-w-[520px] aspect-square mx-auto flex items-center justify-center relative my-1"
                style={{ filter: "drop-shadow(0 0 36px rgba(0, 0, 0, 0.85))" }}
              >
                <div
                  className="absolute -inset-3 rounded-full pointer-events-none z-0"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(200, 164, 93, 0.16) 0%, rgba(30, 82, 74, 0.1) 50%, transparent 72%)",
                  }}
                />

                <div
                  ref={limPointerRef}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 z-20 pointer-events-none origin-top transition-transform duration-75"
                >
                  <svg width="38" height="46" viewBox="0 0 38 46" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                    <path d="M19 44L4 12C2.5 8.5 5 4 9 4H29C33 4 35.5 8.5 34 12L19 44Z" fill="url(#pGold3)" stroke="#fff2cc" strokeWidth="1.8" />
                    <circle cx="19" cy="14" r="4" fill="#10151e" stroke="#f5dca0" strokeWidth="1.5" />
                    <defs>
                      <linearGradient id="pGold3" x1="19" y1="4" x2="19" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f7e2ab" />
                        <stop offset="1" stopColor="#9b732d" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div ref={limWrapperRef} className="w-full h-full relative z-10 p-2 sm:p-3">
                  <canvas
                    ref={limCanvasRef}
                    onClick={handleSpinLimitedOne}
                    className="w-full h-full block cursor-pointer rounded-full"
                  />
                </div>

                <button
                  type="button"
                  disabled={isLimSpinning || currentLimPool.length >= 3 || activeLimitedExpansions.length === 0}
                  onClick={handleSpinLimitedOne}
                  aria-label="Spin Limited Pool Wheel"
                  className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-2 border-amber-300/90 bg-gradient-to-b from-[#1e2636] to-[#0a0d13] shadow-[0_0_25px_rgba(0,0,0,0.95)] hover:enabled:scale-105 active:enabled:scale-95 disabled:opacity-50 transition cursor-pointer"
                >
                  <span className={`${cinzel.className} text-lg font-bold text-amber-300 leading-none`}>3×</span>
                  <span className={`${cinzel.className} text-[9px] tracking-[0.2em] text-amber-200 font-bold mt-0.5`}>
                    SPIN
                  </span>
                </button>
              </div>

              <div className="w-full max-w-[540px] flex flex-wrap items-center justify-center gap-2.5 mt-4">
                <button
                  type="button"
                  disabled={isLimSpinning || limOwnedIds.length < 3}
                  onClick={handleDraftThreeLimited}
                  className={`${SPIN_BTN_CLS} ${cinzel.className} font-bold uppercase tracking-[0.14em] text-xs sm:text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer flex-1 sm:flex-none justify-center min-w-[205px]`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{currentLimPool.length >= 3 ? "Re-Draft 3 Expansions" : "Draft 3 Expansions"}</span>
                </button>

                <button
                  type="button"
                  disabled={isLimSpinning || currentLimPool.length >= 3 || activeLimitedExpansions.length === 0}
                  onClick={handleSpinLimitedOne}
                  className={`px-5 py-3.5 rounded-xl ${PANEL_CLS} hover:border-amber-400/60 text-amber-100 text-xs sm:text-sm font-medium transition cursor-pointer disabled:opacity-45`}
                >
                  Spin 1
                </button>

                <button
                  type="button"
                  disabled={isLimSpinning}
                  onClick={() => {
                    if (limMode === "shared") setLimSharedPool([]);
                    else {
                      setLimPlayerPools((prev) =>
                        prev.map((p, i) => (i === safeLimPlayerIdx ? [] : p))
                      );
                    }
                    showToast("Current Limited Pool cleared.", "info");
                  }}
                  className={`px-4 py-3.5 rounded-xl ${PANEL_CLS} hover:border-red-400/60 text-slate-300 hover:text-red-200 text-xs sm:text-sm transition cursor-pointer`}
                >
                  Clear Pool
                </button>
              </div>

              {/* Active Pool Spotlight */}
              <div className={`w-full max-w-[540px] mt-5 ${PANEL_CLS} rounded-2xl p-5 border-amber-400/35`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`${cinzel.className} text-xs uppercase tracking-[0.2em] text-amber-400/90 font-semibold`}>
                      Legal Card Pool —{" "}
                      {limMode === "shared"
                        ? "Shared Party Pool"
                        : getPlayerDisplayLabel(safeLimPlayerIdx)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Core Set + Investigator Starter Decks + 3 Drafted Expansions
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/30">
                    {currentLimPool.length} / 3
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((slot) => {
                    const picked = currentLimPool[slot];
                    if (picked) {
                      return (
                        <div
                          key={slot}
                          style={{ borderTop: `3px solid ${picked.color}` }}
                          className="p-3 rounded-xl bg-[#0b0f17] border border-amber-400/40"
                        >
                          <div className="text-[10px] uppercase tracking-wider text-amber-400/80 font-mono">
                            Expansion {slot + 1}
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-amber-50 mt-0.5 leading-snug">
                            {picked.name}
                          </div>
                          <div className={`text-[10px] mt-1 ${picked.hasReturn ? "text-emerald-300" : "text-slate-500"}`}>
                            {picked.hasReturn ? "+ Return to cards" : "Full Cycle Cards"}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={slot}
                        className="p-3 rounded-xl bg-[#090c11]/70 border border-dashed border-slate-700 flex flex-col justify-center items-center text-center min-h-[78px]"
                      >
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                          Slot {slot + 1}
                        </span>
                        <span className="text-[11px] text-slate-600 mt-0.5">Awaiting spin</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN: All Players Limited Pools Summary */}
            <section className="lg:col-span-3 space-y-5 order-3">
              <div className={`${PANEL_CLS} rounded-2xl p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className={`${cinzel.className} text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold`}>
                      Drafted Pools
                    </h2>
                    <div className="text-[11px] text-slate-400">
                      {limMode === "shared"
                        ? "Single shared pool for all players"
                        : `Individual pools (${partySize} players)`}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isLimSpinning}
                    onClick={() => {
                      setLimSharedPool([]);
                      setLimPlayerPools([[], [], [], []]);
                      showToast("All Limited Pools cleared.", "info");
                    }}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-red-950/80 text-slate-300 hover:text-red-200 border border-slate-700 transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {limMode === "shared" ? (
                    <div className="p-3 rounded-xl bg-[#0b0f16] border border-amber-500/25 space-y-1.5">
                      <div className={`text-xs ${cinzel.className} font-bold text-amber-300`}>
                        Shared Party Pool ({limSharedPool.length}/3)
                      </div>
                      {limSharedPool.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">Not drafted yet.</div>
                      ) : (
                        limSharedPool.map((e) => (
                          <div key={e.id} className="text-xs text-amber-50">
                            • {e.name}
                            {e.hasReturn && (
                              <span className="text-emerald-300 text-[10px]"> (+Return)</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    Array.from({ length: partySize }).map((_, idx) => {
                      const pPool = limPlayerPools[idx] || [];
                      const isSel = idx === safeLimPlayerIdx;
                      return (
                        <div
                          key={idx}
                          onClick={() => !isLimSpinning && setLimActivePlayerIdx(idx)}
                          className={`p-3 rounded-xl border space-y-1 transition cursor-pointer ${
                            isSel
                              ? "bg-amber-950/25 border-amber-400/50"
                              : "bg-[#0b0f16] border-slate-800 hover:border-slate-600"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-amber-200 truncate">
                              {getPlayerDisplayLabel(idx)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {pPool.length}/3
                            </span>
                          </div>
                          {pPool.length === 0 ? (
                            <div className="text-xs text-slate-500 italic">Not drafted yet.</div>
                          ) : (
                            pPool.map((e) => (
                              <div key={e.id} className="text-xs text-amber-50">
                                • {e.name}
                                {e.hasReturn && (
                                  <span className="text-emerald-300 text-[10px]"> (+Return)</span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Update Roster & Restore Point Modal */}
      {isUpdateModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsUpdateModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        >
          <div className={`${PANEL_CLS} rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 border-amber-400/40`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`${cinzel.className} text-lg sm:text-xl font-bold text-amber-100`}>
                  Roster Updates &amp; Restore Point
                </h2>
                <div className="text-xs text-slate-400">
                  Sync with ArkhamDB, add custom investigators, or back up your entire hub state.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-amber-100 hover:bg-slate-800/80 transition cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* 1. ArkhamDB Sync */}
              <div className="p-4 rounded-xl bg-[#0a0e15] border border-amber-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`${cinzel.className} text-sm font-semibold text-amber-200 uppercase tracking-wider`}>
                      1. Sync with ArkhamDB API
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Imports newly released official investigators from ArkhamDB&apos;s public catalog.
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isSyncingDb}
                    onClick={handleSyncArkhamDB}
                    className={`${SPIN_BTN_CLS} ${cinzel.className} font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg shrink-0 cursor-pointer`}
                  >
                    {isSyncingDb ? "Syncing..." : "Sync Now"}
                  </button>
                </div>
                {syncStatusMsg && (
                  <div className="text-[11px] text-slate-400 mt-2">{syncStatusMsg}</div>
                )}
              </div>

              {/* 2. Add Investigator Manually */}
              <form
                onSubmit={handleAddCustomInvestigator}
                className="p-4 rounded-xl bg-[#0a0e15] border border-amber-500/20 space-y-3"
              >
                <h3 className={`${cinzel.className} text-sm font-semibold text-amber-200 uppercase tracking-wider`}>
                  2. Add Investigator Manually
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={newInvName}
                    onChange={(e) => setNewInvName(e.target.value)}
                    placeholder="Name (e.g. Agatha Crane)"
                    className="bg-[#111722] border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-amber-50 outline-none"
                  />
                  <input
                    type="text"
                    value={newInvSubtitle}
                    onChange={(e) => setNewInvSubtitle(e.target.value)}
                    placeholder="Subtitle (e.g. The Parapsychologist)"
                    className="bg-[#111722] border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-amber-50 outline-none"
                  />
                  <select
                    value={newInvClass}
                    onChange={(e) => setNewInvClass(e.target.value as InvestigatorClass)}
                    className="bg-[#111722] border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-amber-50 outline-none"
                  >
                    {CLASS_ORDER.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newInvEra}
                    onChange={(e) =>
                      setNewInvEra(e.target.value as "Chapter 1" | "Parallel" | "Chapter 2")
                    }
                    className="bg-[#111722] border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-amber-50 outline-none"
                  >
                    <option value="Chapter 2">Chapter 2</option>
                    <option value="Chapter 1">Chapter 1</option>
                    <option value="Parallel">Parallel</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={newInvExpansion}
                    onChange={(e) => setNewInvExpansion(e.target.value)}
                    placeholder="Expansion (e.g. Chapter 2 Expansion)"
                    className="flex-1 bg-[#111722] border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-amber-50 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/50 text-amber-100 text-xs font-semibold transition cursor-pointer"
                  >
                    Add to Wheel
                  </button>
                </div>
              </form>

              {/* 3. Restore Point & JSON Backup */}
              <div className="p-4 rounded-xl bg-[#0a0e15] border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className={`${cinzel.className} text-sm font-semibold text-amber-200 uppercase tracking-wider`}>
                    3. Restore Point &amp; Backup
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {restorePointSavedAt ? `Saved: ${restorePointSavedAt}` : "No snapshot saved"}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Saves investigators, custom campaigns, party, roles, and limited pools locally or to a JSON file.
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSaveRestorePoint}
                    className="px-3 py-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-200 text-xs font-medium transition cursor-pointer"
                  >
                    Save Restore Point
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadRestorePoint}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-200 text-xs font-medium transition cursor-pointer"
                  >
                    Load Restore Point
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-medium transition cursor-pointer"
                  >
                    Export JSON
                  </button>
                  <label className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-medium transition cursor-pointer">
                    Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleFactoryReset}
                    className="px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-red-200 text-xs font-medium transition cursor-pointer"
                  >
                    Factory Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}