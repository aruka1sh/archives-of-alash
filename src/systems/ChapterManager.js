import Phaser from 'phaser';
import { CHAPTERS, CHAPTER_ORDER } from '../data/chapters.js';
import { EVIDENCE, DEDUCTION_PAIRS } from '../data/evidence.js';

export default class ChapterManager {
  constructor() {
    this.activeChapterId = 'ch1';
    this.completedChapters = [];
    this.heritagePoints = 0;
    this.chapterProgress = {};
    this.interviewedNPCs = [];

    // Evidence system
    this.evidence = {};
    this.deductions = [];

    // Trust system
    this.trust = {
      elder: 70,
      teacher: 50,
      archivist: 40
    };

    // Day/night
    this.isEvening = false;
    this.finalChoice = null;

    this.initChapters();
    this.initEvidence();
  }

  initChapters() {
    CHAPTER_ORDER.forEach(id => {
      this.chapterProgress[id] = 0;
    });
  }

  initEvidence() {
    EVIDENCE.forEach(e => {
      this.evidence[e.id] = {
        ...e,
        found: false
      };
    });
  }

  // Chapter methods
  getActiveChapter() {
    const ch = CHAPTERS[this.activeChapterId];
    if (!ch) return null;
    return {
      ...ch,
      progress: this.chapterProgress[this.activeChapterId] || 0
    };
  }

  isChapterActive(chapterId) {
    return this.activeChapterId === chapterId;
  }

  isChapterCompleted(chapterId) {
    return this.completedChapters.includes(chapterId);
  }

  addChapterProgress(amount = 1) {
    this.chapterProgress[this.activeChapterId] =
      (this.chapterProgress[this.activeChapterId] || 0) + amount;
    const ch = CHAPTERS[this.activeChapterId];
    if (!ch) return false;

    if (this.activeChapterId === 'ch1') {
      return this.chapterProgress[this.activeChapterId] >= ch.targetPages;
    }
    return false;
  }

  getChapterProgress() {
    return this.chapterProgress[this.activeChapterId] || 0;
  }

  completeChapter(chapterId) {
    const ch = CHAPTERS[chapterId];
    if (!ch || this.completedChapters.includes(chapterId)) return null;

    this.completedChapters.push(chapterId);
    this.heritagePoints += ch.reward;

    const currentIndex = CHAPTER_ORDER.indexOf(chapterId);
    const nextId = CHAPTER_ORDER[currentIndex + 1] || null;

    if (nextId) {
      this.activeChapterId = nextId;
      this.chapterProgress[nextId] = 0;
    } else {
      this.activeChapterId = null;
    }

    return { chapter: ch, nextChapterId: nextId };
  }

  allChaptersComplete() {
    return CHAPTER_ORDER.every(id => this.completedChapters.includes(id));
  }

  // Evidence methods
  discoverEvidence(evidenceId) {
    if (this.evidence[evidenceId] && !this.evidence[evidenceId].found) {
      this.evidence[evidenceId].found = true;
      const e = this.evidence[evidenceId];
      if (e.optional) {
        this.heritagePoints += 5;
      } else {
        this.heritagePoints += 5;
      }
      return e;
    }
    return null;
  }

  getEvidence() {
    return Object.values(this.evidence);
  }

  getFoundEvidence() {
    return Object.values(this.evidence).filter(e => e.found);
  }

  getEvidenceCount() {
    return this.getFoundEvidence().filter(e => !e.optional).length;
  }

  tryDeduction(evidenceId1, evidenceId2) {
    const pair = DEDUCTION_PAIRS.find(p =>
      (p.pair[0] === evidenceId1 && p.pair[1] === evidenceId2) ||
      (p.pair[0] === evidenceId2 && p.pair[1] === evidenceId1)
    );

    if (pair) {
      if (!this.deductions.find(d => d.result === pair.result)) {
        this.deductions.push({
          evidence1: pair.pair[0],
          evidence2: pair.pair[1],
          result: pair.result
        });
        this.heritagePoints += 10;
        return { success: true, result: pair.result, new: true };
      }
      return { success: true, result: pair.result, new: false };
    }
    return { success: false };
  }

  getDeductions() {
    return this.deductions;
  }

  getDeductionCount() {
    return this.deductions.length;
  }

  // Trust methods
  adjustTrust(npcId, amount) {
    if (this.trust[npcId] !== undefined) {
      this.trust[npcId] = Phaser.Math.Clamp(this.trust[npcId] + amount, 0, 100);
      return this.trust[npcId];
    }
    return null;
  }

  getTrust(npcId) {
    return this.trust[npcId] || 0;
  }

  isNPCInterviewed(npcId) {
    return this.interviewedNPCs.includes(npcId);
  }

  markNPCInterviewed(npcId) {
    if (!this.interviewedNPCs.includes(npcId)) {
      this.interviewedNPCs.push(npcId);
    }
  }

  getInterviewedCount() {
    return this.interviewedNPCs.length;
  }

  // Day/night
  setEvening(val) {
    this.isEvening = val;
  }

  // Final choice
  setFinalChoice(choiceId) {
    this.finalChoice = choiceId;
    this.heritagePoints += 10;
  }

  getFinalChoice() {
    return this.finalChoice;
  }

  // Points
  addPoints(amount) {
    this.heritagePoints += amount;
  }

  getPoints() {
    return this.heritagePoints;
  }

  getRank() {
    if (this.heritagePoints >= 45) return 'HERITAGE KEEPER';
    if (this.heritagePoints >= 28) return 'ARCHIVE SCHOLAR';
    return 'CURIOUS RESEARCHER';
  }

  // Save/load
  saveState() {
    const data = {
      activeChapterId: this.activeChapterId,
      completedChapters: this.completedChapters,
      heritagePoints: this.heritagePoints,
      chapterProgress: this.chapterProgress,
      interviewedNPCs: this.interviewedNPCs,
      evidence: {},
      deductions: this.deductions,
      trust: this.trust,
      isEvening: this.isEvening,
      finalChoice: this.finalChoice
    };
    Object.keys(this.evidence).forEach(k => {
      data.evidence[k] = this.evidence[k].found;
    });
    try {
      localStorage.setItem('archives_of_alash_save', JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  loadState() {
    try {
      const raw = localStorage.getItem('archives_of_alash_save');
      if (!raw) return false;
      const data = JSON.parse(raw);
      this.activeChapterId = data.activeChapterId;
      this.completedChapters = data.completedChapters;
      this.heritagePoints = data.heritagePoints;
      this.chapterProgress = data.chapterProgress;
      this.interviewedNPCs = data.interviewedNPCs;
      this.deductions = data.deductions || [];
      this.trust = data.trust;
      this.isEvening = data.isEvening || false;
      this.finalChoice = data.finalChoice || null;
      Object.keys(data.evidence).forEach(k => {
        if (this.evidence[k]) {
          this.evidence[k].found = data.evidence[k];
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  clearSave() {
    try {
      localStorage.removeItem('archives_of_alash_save');
    } catch (e) {}
  }

  hasSave() {
    try {
      return !!localStorage.getItem('archives_of_alash_save');
    } catch (e) {
      return false;
    }
  }
}

