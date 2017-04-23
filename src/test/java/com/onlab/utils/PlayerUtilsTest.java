package com.onlab.utils;

import com.onlab.entities.Answer;
import com.onlab.entities.Npc;
import com.onlab.entities.Player;
import com.onlab.repositories.NpcRepository;
import com.onlab.repositories.PlayerRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PlayerUtilsTest {
    private static final String USERNAME = "testUser";
    private static final String PASSWORD = "passwd";

    private static final Npc STRONG_NPC = new Npc(999, 999, 999, 99, "Strong Enemy");
    private static final Npc WEAK_NPC = new Npc(1, 1, 1, 1, "Weak Enemy");
    private static final Npc KILLING_NPC = new Npc(15, 9, 500, 10, "Killing Enemy");

    @Mock
    PlayerRepository playerRepository;

    @Mock
    NpcRepository npcRepository;

    @InjectMocks
    PlayerUtils playerUtils;

    Player player;

    Answer.ActualAnswer answer = new Answer().buildActualAnswer();

    @Before
    public void setUp() throws Exception {
        player = new Player();
        player.setUsername(USERNAME);
        player.setPassword(PASSWORD);

        answer.next = 2;
        answer.stayInCity = 0;
        answer.time = 1;
        answer.outcome = "";
    }

    @Test
    public void failAnswer() throws Exception {
        answer.outcome = "fail";
        checkResultForOutcome("Hasn't saved the world today.");
    }

    @Test
    public void winAnswer() throws Exception {
        answer.outcome = "reward";
        checkResultForOutcome("The well-deserved reward is ");
    }

    @Test
    public void fightAndRun() throws Exception {
        when(npcRepository.findByName(anyString())).thenReturn(STRONG_NPC);
        ArgumentCaptor<Player> argument = fightOutCome();
        assertThat("Should have half health plus 20",
                argument.getValue().getHealthPoint(),
                is(player.getMaxHP()/2 + 20));
    }

    @Test
    public void fightAndMakeRun() throws Exception {
        when(npcRepository.findByName(anyString())).thenReturn(WEAK_NPC);
        ArgumentCaptor<Player> argument = fightOutCome();
        assertThat("Should gain XP",
                argument.getValue().getExperience(),
                is(50));
    }

    @Test
    public void fightAndDie() throws Exception {
        when(npcRepository.findByName(anyString())).thenReturn(KILLING_NPC);
        ArgumentCaptor<Player> argument = fightOutCome();
        assertThat("XP should be nulled", argument.getValue().getExperience(), is(0));
    }

    @Test
    public void newGamePlayer() throws Exception {
        player.setExperience(50);
        player.setEpisode(3);
        Player newPlayer = PlayerUtils.newGamePlayer(player);
        assertThat("Username shouldn't change", newPlayer.getUsername(), is(USERNAME));
        assertThat("Password shouldn't change", newPlayer.getPassword(), is(PASSWORD));
        assertThat("Experience should be nulled", newPlayer.getExperience(), is(0));
        assertThat("Episode should be 1", newPlayer.getEpisode(), is(1));
    }

    private void checkResultForOutcome(String expectedResult) {
        String story = PlayerUtils.afterAnsweredModifications(answer, player);
        assertThat("Expected and got story doesn't match", story, containsString(expectedResult));
    }

    private ArgumentCaptor<Player> fightOutCome() {
        PlayerUtils.afterAnsweredModifications(answer, player);
        ArgumentCaptor<Player> argument = ArgumentCaptor.forClass(Player.class);
        verify(playerRepository).save(argument.capture());
        return argument;
    }

}