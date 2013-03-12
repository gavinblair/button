
#import "GCTurnBasedMatchHelper.h"
#import "MainViewController.h"
#import "AppDelegate.h"

NSString *javascriptMessage = @"";

@implementation GCTurnBasedMatchHelper

@synthesize gameCenterAvailable;
@synthesize currentMatch;
@synthesize delegate;
 
#pragma mark Initialization
 
static GCTurnBasedMatchHelper *sharedHelper = nil;
+ (GCTurnBasedMatchHelper *) sharedInstance {
    if (!sharedHelper) {
        sharedHelper = [[GCTurnBasedMatchHelper alloc] init];
    }
    return sharedHelper;
}

- (BOOL)isGameCenterAvailable {
    // check for presence of GKLocalPlayer API
    Class gcClass = (NSClassFromString(@"GKLocalPlayer"));
 
    // check if the device is running iOS 4.1 or later
    NSString *reqSysVer = @"4.1";
    NSString *currSysVer = [[UIDevice currentDevice] systemVersion];
    BOOL osVersionSupported = ([currSysVer compare:reqSysVer     
      options:NSNumericSearch] != NSOrderedAscending);
 
    return (gcClass && osVersionSupported);
}

- (id)init {
    if ((self = [super init])) {
        gameCenterAvailable = [self isGameCenterAvailable];
        if (gameCenterAvailable) {
            NSNotificationCenter *nc = 
            [NSNotificationCenter defaultCenter];
            [nc addObserver:self 
              selector:@selector(authenticationChanged) 
              name:GKPlayerAuthenticationDidChangeNotificationName 
              object:nil];
        }
    }
    return self;
}
 
- (void)authenticationChanged {    
 
    if ([GKLocalPlayer localPlayer].isAuthenticated && 
      !userAuthenticated) {
        NSLog(@"Authentication changed: player authenticated.");
        userAuthenticated = TRUE;           
    } else if (![GKLocalPlayer localPlayer].isAuthenticated && 
      userAuthenticated) {
        NSLog(@"Authentication changed: player not authenticated");
        userAuthenticated = FALSE;
    }
 
}

#pragma mark User functions
 
- (void)authenticateLocalUser { 
	if (!gameCenterAvailable) return;
 
    void (^setGKEventHandlerDelegate)(NSError *) = ^ (NSError *error)
    {
        GKTurnBasedEventHandler *ev = 
          [GKTurnBasedEventHandler sharedTurnBasedEventHandler];
		  
		AppDelegate * delegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
    
        ev.delegate = delegate.self;
    };
 
    NSLog(@"Authenticating local user...");
    if ([GKLocalPlayer localPlayer].authenticated == NO) {     
        [[GKLocalPlayer localPlayer] 
         authenticateWithCompletionHandler:
          setGKEventHandlerDelegate];        
    } else {
        NSLog(@"Already authenticated!");
        setGKEventHandlerDelegate(nil);
    } 
}

- (void)findMatchWithMinPlayers:(int)minPlayers 
  maxPlayers:(int)maxPlayers 
  viewController:(UIViewController *)viewController
                       delegate:(id<GCTurnBasedMatchHelperDelegate>)theDelegate {
    if (!gameCenterAvailable) return;               
 
    presentingViewController = viewController;
 
    GKMatchRequest *request = [[GKMatchRequest alloc] init]; 
    request.minPlayers = minPlayers;     
    request.maxPlayers = maxPlayers;
 
    GKTurnBasedMatchmakerViewController *mmvc = 
      [[GKTurnBasedMatchmakerViewController alloc] 
        initWithMatchRequest:request];    
    mmvc.turnBasedMatchmakerDelegate = self;
    mmvc.showExistingMatches = YES;
 
    [presentingViewController presentModalViewController:mmvc 
      animated:YES];
}

#pragma mark GKTurnBasedMatchmakerViewControllerDelegate
 
-(void)turnBasedMatchmakerViewController: 
  (GKTurnBasedMatchmakerViewController *)viewController 
  didFindMatch:(GKTurnBasedMatch *)match {
    [presentingViewController 
      dismissModalViewControllerAnimated:YES];
    self.currentMatch = match;
    GKTurnBasedParticipant *firstParticipant = 
      [match.participants objectAtIndex:0];
    if (firstParticipant.lastTurnDate == NULL) {
        // It's a new game!
        [delegate enterNewGame:match];
    } else {
        if ([match.currentParticipant.playerID 
          isEqualToString:[GKLocalPlayer localPlayer].playerID]) {
            // It's your turn!
            [delegate takeTurn:match];
        } else {
            // It's not your turn, just display the game state.
            [delegate layoutMatch:match];
        }        
    }
}



-(void)turnBasedMatchmakerViewControllerWasCancelled: 
  (GKTurnBasedMatchmakerViewController *)viewController {
    [presentingViewController 
      dismissModalViewControllerAnimated:YES];
    NSLog(@"has cancelled");
}
 
-(void)turnBasedMatchmakerViewController: 
  (GKTurnBasedMatchmakerViewController *)viewController 
  didFailWithError:(NSError *)error {
    [presentingViewController 
      dismissModalViewControllerAnimated:YES];
    NSLog(@"Error finding match: %@", error.localizedDescription);
}
 
-(void)turnBasedMatchmakerViewController: 
  (GKTurnBasedMatchmakerViewController *)viewController 
  playerQuitForMatch:(GKTurnBasedMatch *)match {
    NSUInteger currentIndex = 
      [match.participants indexOfObject:match.currentParticipant];
    GKTurnBasedParticipant *part;
 
    for (int i = 0; i < [match.participants count]; i++) {
        part = [match.participants objectAtIndex:
          (currentIndex + 1 + i) % match.participants.count];
        if (part.matchOutcome != GKTurnBasedMatchOutcomeQuit) {
            break;
        } 
    }
    NSLog(@"playerquitforMatch, %@, %@", 
      match, match.currentParticipant);
    [match participantQuitInTurnWithOutcome:
      GKTurnBasedMatchOutcomeQuit nextParticipant:part 
      matchData:match.matchData completionHandler:nil];
}

#pragma mark - GCTurnBasedMatchHelperDelegate
 
-(void)enterNewGame:(GKTurnBasedMatch *)match {
    NSLog(@"Entering new game...");
	
	
	
	
	
	
}
 
-(void)takeTurn:(GKTurnBasedMatch *)match {
    NSLog(@"Taking turn for existing game...");
    int playerNum = [match.participants 
      indexOfObject:match.currentParticipant] + 1;
    NSString *statusString = [NSString stringWithFormat:
      @"Player %d's Turn (that's you)", playerNum];


    if ([match.matchData bytes]) {
        NSString *msg = [NSString stringWithUTF8String:
          [match.matchData bytes]];









    }
}

-(void)layoutMatch:(GKTurnBasedMatch *)match {
    NSLog(@"Viewing match where it's not our turn...");
    NSString *statusString;
 
    if (match.status == GKTurnBasedMatchStatusEnded) {
        statusString = @"Match Ended";
    } else {
        int playerNum = [match.participants 
          indexOfObject:match.currentParticipant] + 1;
        statusString = [NSString stringWithFormat:
          @"Player %d's Turn", playerNum];
    }
    
    
    NSString *msg = [NSString stringWithUTF8String:
      [match.matchData bytes]];







}

#pragma mark GKTurnBasedEventHandlerDelegate
 
-(void)handleInviteFromGameCenter:(NSArray *)playersToInvite {
    [presentingViewController 
      dismissModalViewControllerAnimated:YES];
    GKMatchRequest *request = 
      [[[GKMatchRequest alloc] init] autorelease]; 
    request.playersToInvite = playersToInvite;
    request.maxPlayers = 12;
    request.minPlayers = 2;
    GKTurnBasedMatchmakerViewController *viewController =
      [[GKTurnBasedMatchmakerViewController alloc] 
        initWithMatchRequest:request];
    viewController.showExistingMatches = NO;
    viewController.turnBasedMatchmakerDelegate = self;
    [presentingViewController 
      presentModalViewController:viewController animated:YES];
}
 
-(void)handleTurnEventForMatch:(GKTurnBasedMatch *)match {
    NSLog(@"Turn has happened");
    if ([match.matchID isEqualToString:currentMatch.matchID]) {
        if ([match.currentParticipant.playerID 
          isEqualToString:[GKLocalPlayer localPlayer].playerID]) {
            // it's the current match and it's our turn now
            self.currentMatch = match;
            [delegate takeTurn:match];
        } else {
            // it's the current match, but it's someone else's turn
            self.currentMatch = match;
            [delegate layoutMatch:match];
        }
    } else {
        if ([match.currentParticipant.playerID 
          isEqualToString:[GKLocalPlayer localPlayer].playerID]) {
            // it's not the current match and it's our turn now
            [delegate sendNotice:@"It's your turn for another match" 
              forMatch:match];
        } else {
            // it's the not current match, and it's someone else's 
            // turn
        }
    }
}

-(void)sendNotice:(NSString *)notice forMatch:
  (GKTurnBasedMatch *)match {
    UIAlertView *av = [[UIAlertView alloc] initWithTitle:
      @"Another game needs your attention!" message:notice 
      delegate:self cancelButtonTitle:@"Sweet!" 
      otherButtonTitles:nil];
    [av show];
    [av release];
}



- (void)getMatch:(CDVInvokedUrlCommand*)command{
    CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
	
    AppDelegate * delegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
    
	
	[[GCTurnBasedMatchHelper sharedInstance]
      findMatchWithMinPlayers:2 maxPlayers:2 viewController:delegate.viewController delegate:self];
			
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)login:(CDVInvokedUrlCommand*)command{
    CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
	
	if([GKLocalPlayer localPlayer].authenticated == YES){
		AppDelegate * delegate = (AppDelegate *) [UIApplication sharedApplication].delegate;
    
	
		[[GCTurnBasedMatchHelper sharedInstance]
      	findMatchWithMinPlayers:2 maxPlayers:2 viewController:delegate.viewController delegate:self];
			
    
	} else {
    	[[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"gamecenter:/me"]];
	}
		
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (void)getMessage:(CDVInvokedUrlCommand*)command{
    CDVPluginResult* pluginResult = nil;
	
	NSString *statusString = javascriptMessage;
	
	
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:statusString];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)sendTurn:(CDVInvokedUrlCommand*)command{

	CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
	
    GKTurnBasedMatch *currentMatch = 
      [[GCTurnBasedMatchHelper sharedInstance] currentMatch];
    
	NSString* msg = [command.arguments objectAtIndex:0];
	
	NSData *data =
      [msg dataUsingEncoding:NSUTF8StringEncoding ];
 
    NSUInteger currentIndex = [currentMatch.participants 
      indexOfObject:currentMatch.currentParticipant];
    GKTurnBasedParticipant *nextParticipant;
 
    NSUInteger nextIndex = (currentIndex + 1) % 
      [currentMatch.participants count];
    nextParticipant = 
      [currentMatch.participants objectAtIndex:nextIndex];
 
    for (int i = 0; i < [currentMatch.participants count]; i++) {
        nextParticipant = [currentMatch.participants 
          objectAtIndex:((currentIndex + 1 + i) % 
          [currentMatch.participants count ])];
        if (nextParticipant.matchOutcome != 
            GKTurnBasedMatchOutcomeQuit) {
            break;
        } 
    }
 
    [currentMatch endTurnWithNextParticipant:nextParticipant 
      matchData:data completionHandler:^(NSError *error) {
        if (error) {
            NSLog(@"%@", error);
            
					
		} else {
		
		
		
        }
    }];
    NSLog(@"Send Turn, %@, %@", data, nextParticipant);
    
	
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
