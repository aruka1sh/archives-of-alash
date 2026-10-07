import { QUESTS, QUEST_ORDER } from '../data/quests.js';

export default class QuestManager {
  constructor(scene) {
    this.scene = scene;
    this.quests = {};
    this.activeQuestId = null;
    this.completedQuests = [];
    this.heritagePoints = 0;
    this.progress = {};

    this.initQuests();
  }

  initQuests() {
    for (const [key, quest] of Object.entries(QUESTS)) {
      this.quests[key] = { ...quest, completed: false };
      this.progress[key] = 0;
    }
  }

  startQuest(questId) {
    if (this.quests[questId] && !this.quests[questId].completed) {
      this.activeQuestId = questId;
      return this.quests[questId];
    }
    return null;
  }

  addProgress(questId, amount = 1) {
    if (!this.progress[questId]) {
      this.progress[questId] = 0;
    }
    this.progress[questId] += amount;
    const quest = this.quests[questId];
    if (quest && this.progress[questId] >= quest.target) {
      return true;
    }
    return false;
  }

  getProgress(questId) {
    return this.progress[questId] || 0;
  }

  completeQuest(questId) {
    const quest = this.quests[questId];
    if (quest && !quest.completed) {
      quest.completed = true;
      this.completedQuests.push(questId);
      this.heritagePoints += quest.reward;

      const currentIndex = QUEST_ORDER.indexOf(questId);
      const nextQuestId = QUEST_ORDER[currentIndex + 1] || null;

      if (nextQuestId) {
        this.activeQuestId = nextQuestId;
        this.progress[nextQuestId] = 0;
      } else {
        this.activeQuestId = null;
      }

      return { quest, nextQuestId };
    }
    return null;
  }

  getActiveQuest() {
    if (this.activeQuestId) {
      return {
        ...this.quests[this.activeQuestId],
        progress: this.progress[this.activeQuestId] || 0
      };
    }
    return null;
  }

  isQuestActive(questId) {
    return this.activeQuestId === questId;
  }

  isQuestCompleted(questId) {
    return this.completedQuests.includes(questId);
  }

  addPoints(amount) {
    this.heritagePoints += amount;
  }

  getPoints() {
    return this.heritagePoints;
  }

  getRank() {
    if (this.heritagePoints >= 30) return 'HERITAGE KEEPER';
    if (this.heritagePoints >= 20) return 'ARCHIVE SCHOLAR';
    return 'CURIOUS RESEARCHER';
  }

  areAllQuestsComplete() {
    return QUEST_ORDER.every(qId => this.completedQuests.includes(qId));
  }
}